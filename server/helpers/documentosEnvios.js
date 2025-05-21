// documentosEnvios.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer, { executablePath } from "puppeteer";
import { enviarCorreoFicha } from "../API/emails/enviar-email.js";
import Administrador from "../API/models/db/Administrador.js";
import { reemplazarVariables } from "./remplazos.js";
import {
  __dirname,
  consoleConnection,
  getFechaCubaText,
  getHoraCubaText,
} from "../utils/utils.js";
import { consoleError } from "../utils/logger.js";

// Configurar rutas multiplataforma
const isWindows = process.platform === "win32";
const wkhtmlPath = path.join(
  process.cwd(),
  "bin",
  `wkhtmltopdf${isWindows ? ".exe" : ""}`
);

// Modificar en documentosEnvios.js la función generarPDFDesdeHTML
const generarPDFDesdeHTML = async (html, userId) => {
  let browser;
  try {
    const capabilities = {
      browserName: "chrome", // chrome, firefox, edge, safari
      browserVersion: "latest",
      os: "Windows",
      osVersion: "11",
      resolution: "1920x1080",
      build: "Ficha de Envio",
      name: "Ficha de Envio",
      "browserstack.local": "false", // Para pruebas locales (necesita el tunnel)
      "browserstack.debug": "true", // Habilita logs detallados
    };

    const wsUrl = `wss://cdp.browserstack.com/puppeteer?caps=${encodeURIComponent(
      JSON.stringify(capabilities)
    )}`;

    browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NAVIGATOR_USERNAME}:${process.env.NAVIGATOR_ACCESS_KEY}`
        ).toString("base64")}`,
      },
    });

    const page = await browser.newPage();

    // Configurar correctamente las rutas locales
    const baseUrl =
      "file://" +
      encodeURI(path.join(process.cwd(), "public").replace(/\\/g, "/")); //+ "/";

    // Configurar intercepción de solicitudes mejorada
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      const url = request.url();

      // Permitir imágenes locales y CSS
      if (
        url.startsWith(baseUrl) ||
        url.includes("bootstrap.min.css") ||
        url.endsWith(".png") ||
        url.endsWith(".jpg")
      ) {
        request.continue();
      } else {
        request.abort();
      }
    });

    // Forzar espera de recursos
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 120000,
    });

    if (page.isClosed()) {
      throw new Error("La página se cerró inesperadamente");
    }

    // Esperar carga de imágenes
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        selectors.map((img) => {
          return (
            img.complete ||
            new Promise((resolve) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve);
            })
          );
        })
      );
    });

    const pdfBuffer = await page.pdf({
      format: "Letter",
      margin: { top: "3mm", bottom: "3mm", left: "3mm", right: "3mm" },
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 120000, // ⭐ Añadir timeout para PDF
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    if (!userId || userId === null || userId === undefined) {
      consoleConnection(`Error con userId y error: ${error}`, "red");
    } else {
      consoleError(userId, error, "red");
    }
  } finally {
    // Cerrar el navegador en cualquier caso
    if (browser && browser.isConnected()) {
      const pages = await browser.pages();
      await Promise.all(
        pages.map(async (page) => {
          if (!page.isClosed()) await page.close();
        })
      );
      await browser.close();
    }
  }
};

const generarFichaEnvio = async (
  newPack,
  newPersonalPack = [],
  newRequestPack = [],
  newStorePack = [],
  loggedUser,
  userId
) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../API/models/templates/fichaEnvio.html"
    );

    if (!newPersonalPack || newPersonalPack === null) newPersonalPack = [];
    if (!newRequestPack || newRequestPack === null) newRequestPack = [];
    if (!newStorePack || newStorePack === null) newStorePack = [];

    // Leer plantilla y procesar variables
    const htmlContent = await fs.readFile(templatePath, "utf8");
    const processedHTML = await reemplazarVariables(htmlContent, {
      logged:
        (await Administrador.findByPk(loggedUser.mail, {
          attributes: ["pNombre", "sNombre", "aPaterno", "aMaterno"],
          raw: true,
        })) || {},
      newPack: {
        ...newPack,
        fCreado: newPack.fCreado || getFechaCubaText(),
        hCreado: newPack.hCreado || getHoraCubaText(),
      },
      newPersonalPack: newPersonalPack.map((p) => ({
        ...p,
        Producto: p.Producto || {
          nombreProd: "No especificado",
          Categoria: { nombreCat: "N/A", precio: 0 },
        },
      })),
      newRequestPack: newRequestPack.map((p) => ({
        ...p,
        Producto: p.Producto || {
          nombreProd: "No especificado",
          Categoria: { nombreCat: "N/A", precio: 0 },
        },
      })),
      newStorePack: newStorePack.map((p) => ({
        ...p,
        Producto: p.Producto || { nombreProd: "No especificado" },
      })),
    });

    // Generar y enviar PDF
    const pdfBuffer = await generarPDFDesdeHTML(processedHTML, userId);
    await enviarCorreoFicha({
      userName: loggedUser.userName,
      mail: loggedUser.mail,
      pdfBuffer,
      pdfName: `Ficha-${newPack.usuario}-${newPack.idPaquete}.pdf`,
    });

    console.log(`✅ Ficha enviada a ${newPack.usuario}`);
    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

export default generarFichaEnvio;
