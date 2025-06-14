import { List } from "../../utils/List.js";
import { calcularOffset, calcularPaginas } from "../../utils/utils.js";
import Pais from "../models/Pais.js";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import { ICountry } from "../interfaces/ICountry.js";
import { Request } from "express";
import { Op } from "sequelize";
import { IRole } from "../models/interfaces/IRole.js";
import Rol from "../models/Rol.js";
import Representante from "../models/Representante.js";

export class SpecialsServices {
  async listCountriesService(
    page: number = 1,
    req: Request
  ): Promise<{
    countries: ICountry[];
    paginated: IPaginated;
    success: boolean;
  }> {
    try {
      const offset = calcularOffset(page, 50);

      let options = {};
      if (req.query.name) {
        options = {
          where: {
            nombre: { [Op.iRegexp]: req.query.name },
          },
        };
      }
      const pais = await Pais.findAndCountAll({
        offset,
        limit: 50,
        ...options,
      });

      const countries = new List<ICountry>();
      for (let c of pais.rows) {
        if (!c) {
          throw new Error("Bad, Error");
        }

        const deputy = await Representante.findOne({
          where: { id_pais: c.id_pais, estado: true },
          order: [["f_registro", "DESC"]],
        });

        const country = {
          id: Number(c.id_pais),
          name: c.nombre,
          deputy: deputy
            ? `${deputy?.p_nombre} ${deputy?.p_apellido}`
            : undefined,
        };

        countries.add(country);
      }

      const { totalPages, totalRecords } = calcularPaginas(pais.count, 50);

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

  async listRolesService(
    page: number = 1,
    req: Request
  ): Promise<{
    roles: IRole[];
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
      const rol = await Rol.findAndCountAll({
        limit: 10,
        offset,
        ...options,
      });

      const roles = new List<IRole>();
      for (let r of rol.rows) {
        if (!r) {
          throw new Error("Bad, Error");
        }

        const role = {
          id: Number(r.id_rol),
          name: r.nombre,
        };

        roles.add(role);
      }

      const { totalPages, totalRecords } = calcularPaginas(rol.count, 10);
      const paginated = new GeneralPaginated(totalPages, totalRecords, page);

      return {
        success: true,
        roles: roles.elements,
        paginated: paginated.data,
      };
    } catch (error: any) {
      console.error("Error en servicio de listar paises:", error);

      throw error;
    }
  }
}
