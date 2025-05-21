import Cliente from "../API/models/db/Cliente.js";
import Estado from "../API/models/db/Estado.js";
import Paquete from "../API/models/db/Paquete.js";
import Pend_Puntuacion from "../API/models/db/Pend_Puntuacion.js";
import { obtenerSocketsPorUsuario } from "../sockets/controller.js";

// ========== HELPERS REUTILIZABLES ==========
const safeData = (entity) => entity?.dataValues || {};
const optionalMap = (arr, fn) => (arr?.length ? arr.map(fn) : []);

// ========== TRANSACCIONES Y NOTIFICACIONES ==========
export const revertirTransaccion = async (res, error, transaction, message) => {
  await transaction.rollback();
  console.error(error);
  res.status(500).json({ message: error.message || message });
};

export const notificarError = async (userId, error, message) => {
  const socket = obtenerSocketsPorUsuario(userId);
  if (!socket)
    return console.log("Notificación incorrecta: userId no encontrado");

  const errorMessage = error.message.includes("callback")
    ? "Es necesario establecer una función que espere la respuesta."
    : error.message || message;

  socket.socketActual.emit("notificar-mensaje", { message: errorMessage });
};

// ========== PREPARADORES DE DATOS ==========
const prepararListado = (entidades, prepararEntidad) =>
  optionalMap(entidades, prepararEntidad);

const prepararDireccion = (entity) => {
  const { Municipio, calle = "", numero = "", Reparto } = safeData(entity);
  return {
    address: {
      town: Municipio ? prepararMunicipio(Municipio) : null,
      street: calle,
      department: numero,
      zone: Reparto ? prepararReparto(Reparto).zone : "",
    },
  };
};

const prepararMunicipio = (entity) => {
  const { codMcpio, nombreMcpio, codigoPostal, Provincium } = safeData(entity);
  return {
    id: codMcpio ?? null,
    town: nombreMcpio || "",
    postalCode: codigoPostal || "00000",
    province: Provincium ? prepararProvincia(Provincium) : null,
  };
};

const prepararProvincia = (entity) => {
  const { codProvincia, nombreProv } = safeData(entity);
  return { id: codProvincia, province: nombreProv };
};

export const prepararUsuario = (entity) => {
  const { usuario, fCreado, estado, message } = safeData(entity);
  return {
    userName: usuario,
    createdDate: fCreado,
    state: estado ? "Activo" : "Eliminado",
    ...(message && { message }),
  };
};

export const prepararAdministrador = (admin) => {
  const {
    correo,
    pNombre,
    sNombre,
    aPaterno,
    aMaterno,
    celular,
    codVerif,
    Usuario,
  } = safeData(admin);
  return {
    mail: correo,
    firstName: pNombre,
    secondName: sNombre,
    firstSurname: aPaterno,
    secondSurname: aMaterno,
    phone: celular,
    verified: codVerif === "verificado",
    ...(Usuario && prepararUsuario(Usuario)),
  };
};

export const prepararCliente = async (client) => {
  const baseClient = prepararAdministrador(client);
  const { Cliente: clienteData, CPS: cpsData } = safeData(client);

  const mergedClient = {
    ...baseClient,
    ...(clienteData && {
      ...prepararDatosCliente(clienteData),
      ...prepararDireccion(clienteData),
    }),
    ...(cpsData && {
      ...prepararDatosCliente(cpsData),
      ...prepararDireccion(client),
    }),
  };

  const [numberReferrals, numberPackages, pendingPointsCount] =
    await Promise.all([
      Cliente.count({ where: { correoInv: mergedClient.mail } }),
      Paquete.count({ where: { usuario: mergedClient.userName } }),
      Pend_Puntuacion.count({ where: { usuario: mergedClient.userName } }),
    ]);

  return {
    ...mergedClient,
    numberReferrals,
    numberPackages,
    pendingPoints: pendingPointsCount !== 0,
  };
};

const prepararDatosCliente = (data) => ({
  address: {},
  cps: data.CPS,
  points: data.puntos,
  referralsLink: data.link,
  referrerEmail: data.correoInv || "free",
});

export const prepararDestinatario = (recipient) => ({
  ...prepararDireccion(recipient),
  ...Object.fromEntries(
    Object.entries({
      id: "idDestinatario",
      identityCard: "CI",
      firstName: "pNombre",
      secondName: "sNombre",
      firstSurname: "aPaterno",
      secondSurname: "aMaterno",
      phone: "celular",
    }).map(([key, val]) => [key, safeData(recipient)[val]])
  ),
});

export const prepararReferido = (referred) => ({
  ...prepararAdministrador(referred.Administrador),
  ...prepararDireccion(referred),
  referralsLink: referred.dataValues.link,
  points: referred.dataValues.puntos,
});

// ========== PRODUCTOS Y SOLICITUDES ==========
export const prepararProducto = (product) => {
  const { idProd, nombreProd, Categoria } = safeData(product);
  return {
    id: idProd,
    name: nombreProd,
    category: prepararCategoria(Categoria),
  };
};

export const prepararCategoria = (category) => {
  const { idCategoria, nombreCat, especialidad, precio } = safeData(category);
  return {
    id: idCategoria,
    name: nombreCat,
    specialty: especialidad,
    price: precio,
  };
};

export const prepararProductoTienda = (product) => {
  const { cantidad, precioPtos, estado, urlImagen, Administrador } =
    safeData(product);
  return {
    ...prepararProducto(product),
    amount: cantidad,
    pricePoints: precioPtos,
    status: estado ? "Disponible" : "No Disponible",
    creator: `${Administrador?.pNombre || ""} ${
      Administrador?.sNombre || ""
    }`.trim(),
    image: urlImagen || "https://via.placeholder.com/150",
  };
};

export const prepararSolicitud = (request) => {
  const data = safeData(request);
  const common = {
    id: data.idPaquete,
    dateCreated: data.fCreado,
    timeCreated: data.hCreado,
    userName: data.usuario,
    status: data.Estado ? prepararEstado(data.Estado).name : "",
  };

  return {
    ...common,
    addressee: prepararDestinatario(data.Destinatario),
    fromStore: optionalMap(
      data.paq_prod_stocks,
      ({ cantidad, costo, prod_stock }) => ({
        amount: cantidad,
        cost: costo,
        product: prepararProductoTienda(prod_stock),
      })
    ),
    request: optionalMap(data.Solicitud?.Solic_prods, ({ dataValues: dv }) => ({
      id: dv.idSolicitud,
      amount: dv.cantidad,
      productLink: dv.enlaceProd,
      product: dv.Producto ? prepararProducto(dv.Producto) : null,
      store: dv.Tienda
        ? { id: dv.Tienda.idTienda, name: dv.Tienda.nombreTienda }
        : null,
    })),
    productsSent: optionalMap(
      data.paq_prods,
      ({ dataValues: dv, cantidad }) => ({
        ...(dv.Producto ? prepararProducto(dv.Producto) : {}),
        amount: cantidad,
      })
    ),
  };
};

// ========== RESTANTES FUNCIONES ==========
export const prepararPendiente = (pending) => ({
  ...prepararUsuario(pending.Usuario),
  dateLastShipping: pending.dataValues.fechaEnvio,
  quantityShippingUnassigned: pending.dataValues.cantidad,
});

export const prepararReparto = (zone) => {
  const { nombreReparto, idReparto } = safeData(zone);
  return { zone: nombreReparto, id: idReparto };
};

export const prepararEstado = (status) => {
  const { idEstado, nombreEstado } = safeData(status);
  return { id: idEstado, name: nombreEstado };
};

export const prepararPaquete = async (pack) => {
  const { information, personalPack, requestPack, storePack } = pack;
  const { idPaquete, usuario, Destinatario, fCreado, hCreado, idEstado } =
    safeData(information);

  const status = await Estado.findByPk(idEstado);
  const totalCost =
    storePack?.reduce(
      (acc, { cantidad, costo }) => acc + cantidad * costo,
      0
    ) || 0;

  return {
    information: {
      id: idPaquete,
      userName: usuario,
      addressee: prepararDestinatario(Destinatario),
      dateCreated: fCreado,
      timeCreated: hCreado,
      status: status?.dataValues.nombreEstado || "",
      ...(storePack && { totalCost }),
    },
    personalPack: optionalMap(personalPack, (p) => ({
      ...prepararProducto(p.Producto),
      amount: p.cantidad,
    })),
    requestPack: optionalMap(requestPack, (p) => ({
      ...prepararProducto(p.Producto),
      amount: p.cantidad,
      productLink: p.enlaceProd,
      store: p.Tienda ? safeData(p.Tienda).nombreTienda : null,
    })),
    storePack: optionalMap(storePack, (p) => ({
      ...prepararProducto(p.Producto),
      amount: p.cantidad,
      cost: p.costo,
      totalPoints: p.cantidad * p.costo,
    })),
  };
};

// ========== PREPARADORES DE LISTADOS ==========
export const [
  prepararEnvioMunicipios,
  prepararEnvioProvincias,
  prepararEnvioAdministradores,
  prepararEnvioDestinatarios,
  prepararEnvioReferidos,
  prepararEnvioProductos,
  prepararEnvioCategorias,
  prepararEnvioProductosTienda,
  prepararEnvioSolicitudes,
  prepararEnvioPendientes,
  prepararEnvioRepartos,
  prepararEnvioEstados,
] = [
  prepararMunicipio,
  prepararProvincia,
  prepararAdministrador,
  prepararDestinatario,
  prepararReferido,
  prepararProducto,
  prepararCategoria,
  prepararProductoTienda,
  prepararSolicitud,
  prepararPendiente,
  prepararReparto,
  prepararEstado,
].map((fn) => (items) => prepararListado(items, fn));

export const prepararEnvioClientes = (clients) =>
  Promise.all(clients.map(prepararCliente));
export const prepararEnvioPaquetes = (packages) =>
  Promise.all(packages.map(prepararPaquete));
