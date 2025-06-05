import { List } from "../../utils/List.js";
import { calcularOffset, calcularPaginas } from "../../utils/utils.js";
import Pais from "../models/Pais.js";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import { ICountry } from "../interfaces/ICountry.js";
import { Request } from "express";
import { Op } from "sequelize";

export class CountryServices {
  async listCountriesService(
    page: number = 1,
    req: Request
  ): Promise<{
    countries: ICountry[];
    paginated: IPaginated;
    success: boolean;
  }> {
    try {
      const offset = calcularOffset(page, 10);

      let options = {};
      if (req.query.name) {
        options = {
          where: {
            nombre: { [Op.iRegexp]: req.query.name },
          },
        };
      }
      const pais = await Pais.findAndCountAll({
        limit: 10,
        offset,
        ...options,
      });

      const countries = new List<ICountry>();
      for (let c of pais.rows) {
        if (!c) {
          throw new Error("Bad, Error");
        }
        const country = {
          id: Number(c.id_pais),
          name: c.nombre,
        };

        countries.add(country);
      }

      const { totalPages, totalRecords } = calcularPaginas(pais.count, 10);
      const paginated = new GeneralPaginated(totalPages, totalRecords, page);

      return {
        success: true,
        countries: countries.elements,
        paginated: paginated.data,
      };
    } catch (error: any) {
      console.error("Error en servicio de listar paises:", error);

      throw error;
    }
  }
}
