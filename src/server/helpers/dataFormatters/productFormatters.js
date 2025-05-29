// src/helpers/dataFormatters/productFormatters.js
import { safeData, optionalMap } from "../database/dataHelpers.js";
import { prepararDestinatario } from "./recipientFormatters.js";
import { prepararEstado } from "./statusFormatters.js";

// ========== FUNCIONES BASE ==========
export const prepararProducto = (product) => {
  const { idProd, nombreProd, Categoria } = safeData(product);
  return {
    id: idProd,
    name: nombreProd,
    category: Categoria ? prepararCategoria(Categoria) : null,
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

// ========== FORMATO TIENDA ==========
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

// ========== FORMATO SOLICITUDES ==========
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
