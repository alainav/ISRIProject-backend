import Destinatario from "../API/models/db/Destinatario.js";
import Empresa from "../API/models/db/Empresa.js";
import {
  incluirMunicipio,
  incluirReparto,
} from "../API/controllers/inclusiones/inclusionesUsuario.js";
import path from "path";
import { __dirname, convertImagetoURL } from "../utils/utils.js";
import os from "os";
import { fileURLToPath } from "url";

export const reemplazarVariables = async (htmlContent, information) => {
  const { logged, newPack, newPersonalPack, newRequestPack, newStorePack } =
    information;

  //Escribir el numero de ficha
  htmlContent = remplazarContenido(
    htmlContent,
    "numeroFicha",
    `${newPack.fCreado.replaceAll("-", "")}-${newPack.hCreado
      .replaceAll(":", "")
      .replace(" ", "")
      .replace("a.m.", "")
      .replace("p.m.", "")}${newPack.idPaquete}`
  );
  //Escribir el usuario
  htmlContent = remplazarContenido(
    htmlContent,
    "usuario",
    `${newPack.usuario}`
  );

  //Escribir la fecha
  htmlContent = remplazarContenido(
    htmlContent,
    "fechaEmitida",
    `${newPack.fCreado} ${newPack.hCreado}`
  );

  //Escribir el numero de envio
  htmlContent = remplazarContenido(
    htmlContent,
    "noEnvio",
    `${newPack.idPaquete}`
  );

  //Escribir el nombre del cliente
  htmlContent = remplazarContenido(
    htmlContent,
    "nombreCliente",
    `${logged.pNombre} ${logged.sNombre != null ? logged.sNombre : ""} ${
      logged.aPaterno
    } ${logged.aMaterno}`
  );

  //Escribir el nombre de la empresa
  const company = await Empresa.findOne();
  htmlContent = remplazarContenido(
    htmlContent,
    "nombreEmpresa",
    `${company.dataValues.nombre}`
  );

  //Escribir datos del destinatario
  const addressee = await Destinatario.findByPk(newPack.idDestinatario, {
    include: [incluirMunicipio, incluirReparto],
  });
  // Validar destinatario
  if (!addressee?.dataValues) {
    throw new Error("Destinatario no encontrado");
  }
  htmlContent = remplazarContenido(
    htmlContent,
    "CIDestinatario",
    `${addressee.dataValues.CI}`
  );
  htmlContent = remplazarContenido(
    htmlContent,
    "nombreDestinatario",
    `${addressee.dataValues.pNombre} ${
      addressee.dataValues.sNombre != null ? addressee.dataValues.sNombre : ""
    } ${addressee.dataValues.aPaterno} ${addressee.dataValues.aMaterno}`
  );
  htmlContent = remplazarContenido(
    htmlContent,
    "direccion",
    `${addressee.dataValues.calle} #${addressee.dataValues.numero}, ${addressee.dataValues.Municipio.nombreMcpio}, ${addressee.dataValues.Municipio.Provincium.nombreProv}`
  );
  htmlContent = remplazarContenido(
    htmlContent,
    "celularDestinatario",
    `${addressee.dataValues.celular}`
  );

  const info = {
    pack: newPersonalPack,
    request: newRequestPack,
    store: newStorePack,
  };

  const tableInformation = agregarDatosTabla(info);
  //Agregando productos a la tabla
  htmlContent = remplazarContenido(
    htmlContent,
    "tablaProductos",
    tableInformation.information
  );
  htmlContent = remplazarContenido(
    htmlContent,
    "totalPrecio",
    tableInformation.total
  );
  htmlContent = remplazarContenido(
    htmlContent,
    "cantidadTotal",
    tableInformation.totalAmount
  );
  htmlContent = remplazarContenido(
    htmlContent,
    "totalUnidades",
    tableInformation.totalUnits
  );

  const baseUrl = await convertImagetoURL("Logo_Empresa_Final.png");
  htmlContent = remplazarContenido(htmlContent, "baseUrl", baseUrl);

  return htmlContent;
};

const remplazarContenido = (htmlContent, toReplace, replace) => {
  return htmlContent.replaceAll(`{{${toReplace}}}`, replace);
};

const agregarDatosTabla = ({ pack, request, store }) => {
  let information = "";
  let aux = 0;
  let total = 0;
  let totalUnits = 0;

  if (pack && pack != null) {
    for (const tempPack of pack) {
      aux++;
      information += `<tr>
          <td>${aux}</td>
          <td>${tempPack.Producto.nombreProd}</td>
          <td>${tempPack.Producto.Categoria.nombreCat}</td>
          <td>Envío</td>
          <td>${tempPack.cantidad}</td>
          <td>${
            tempPack.Producto.Categoria.precio != 0
              ? `$${tempPack.Producto.Categoria.precio}`
              : "Por libras"
          }</td>
          <td>$${tempPack.Producto.Categoria.precio * tempPack.cantidad}</td>
          </tr>`;
      total += tempPack.Producto.Categoria.precio * tempPack.cantidad;
      totalUnits += tempPack.cantidad;
    }
  }

  if (request && request != null) {
    for (const req of request) {
      aux++;
      information += `<tr>
          <td>${aux}</td>
          <td>${req.Producto.nombreProd}</td>
          <td>${req.Producto.Categoria.nombreCat}</td>
          <td>${req.tienda != null ? req.tienda.nombreTienda : "Solicitud"}</td>
          <td>${req.cantidad}</td>
          <td>${
            req.Producto.Categoria.precio != 0
              ? `$${req.Producto.Categoria.precio}`
              : "Por libras"
          }</td>
          <td>$${req.Producto.Categoria.precio * req.cantidad}</td>
          </tr>`;
      total += req.Producto.Categoria.precio * req.cantidad;
      totalUnits += req.cantidad;
    }
  }

  if (store && store != null) {
    for (const tempPack of store) {
      aux++;
      information += `<tr>
          <td>${aux}</td>
          <td>${tempPack.Producto.nombreProd}</td>
          <td>${tempPack.Producto.Categoria.nombreCat}</td>
          <td>Compra</td>
          <td>${tempPack.cantidad}</td>
          <td>${tempPack.costo}</td>
          <td>${tempPack.costo * tempPack.cantidad} ptos</td>
          </tr>`;
      total += tempPack.costo * tempPack.cantidad;
    }
  }

  return { total: `${total}`, information, totalAmount: aux, totalUnits };
};
