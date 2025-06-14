import moment from "moment";
import { List } from "../../utils/List.js";
import {
  calcularOffset,
  calcularPaginas,
  getFechaCuba,
} from "../../utils/utils.js";
import { ICommissionElement } from "../interfaces/ICommissionElements.js";
import { IGeneralResponse } from "../interfaces/IGeneralResponse.js";
import { IRegistrerCommission } from "../interfaces/IRegistrerCommission.js";
import Comision from "../models/Comision.js";
import Comision_Pais from "../models/Comision_Pais.js";
import Edicion from "../models/Edicion.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import { ICommission } from "../models/interfaces/ICommision.js";
import Pais from "../models/Pais.js";
import Representante from "../models/Representante.js";
import { Op, Transaction } from "sequelize";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import { sequelize } from "../config/databaseConection.js";
import Voto from "../models/Voto.js";
import Votacion from "../models/Votacion.js";
import { isString } from "class-validator";

export class CommissionServices {
  async registerCommissionService(
    requestData: IRegistrerCommission,
    transaction?: Transaction
  ): Promise<ICommission> {
    transaction = transaction ? transaction : await sequelize.transaction();
    try {
      let { name, countries, edition, president, secretary } = requestData;

      let edicion;
      if (Number.isInteger(edition)) {
        edicion = await Edicion.findByPk(edition);
      } else if (isString(edition)) {
        edicion = await Edicion.findOne({ where: { nombre: edition } });
      }

      if (!edicion) {
        throw new Error(`ID ${edition} no encontrado en ediciones`);
      }

      if (!president || !secretary) {
        throw new Error(
          "No ha enviado el campo president o el campo secretary"
        );
      }

      const representante = await Representante.findAll({
        where: { usuario: { [Op.or]: [president, secretary] } },
      });

      if (!representante) {
        throw new Error("No existe el usuario enviado");
      }
      const comision = await Comision.create(
        {
          nombre: name,
          id_edicion: edicion.id_edicion,
          presidente: president,
          secretario: secretary,
        },
        { transaction }
      );

      if (!comision.id_comision) {
        throw new Error("Problemas al crear la comision");
      }

      const result = new List<ICommissionElement>();

      if (countries[0] === 0) {
        const paises = await Pais.findAll();
        countries = paises.map((p) => {
          return p.id_pais;
        });
      }

      for (let c of countries) {
        const country = await Pais.findByPk(c);

        if (!country) {
          throw new Error(`ID ${c} no encontrado en los Paises`);
        }

        await Comision_Pais.create(
          {
            id_comision: comision.id_comision,
            id_pais: c,
          },
          { transaction }
        );

        const deputy = await Representante.findOne({
          where: { id_pais: c, estado: true },
          order: [["f_registro", "DESC"]],
        });

        if (!deputy) {
          throw new Error("Bad Deputy");
        }

        const element = {
          id: country.id_pais,
          name: country.nombre,
          deputy: `${deputy.p_nombre} ${deputy.p_apellido}`,
        };
        result.add(element);
      }

      await transaction.commit();
      return {
        success: true,
        message: "Comisión agregada con éxito",
        name: comision.nombre,
        edition: edicion.nombre,
        id_commission: comision.id_comision,
        numOfCountries: result.elements.length,
        countries: result.elements,
      };
    } catch (error: any) {
      console.error("Error en servicio de comisiones:", error);
      await transaction.rollback();
      throw error;
    }
  }

  async updateCommissionService(
    id: number,
    data: IRegistrerCommission
  ): Promise<ICommission> {
    try {
      const { name, countries = [], edition, president, secretary } = data;

      const comision = await Comision.findByPk(id);

      if (!comision) {
        throw new Error(`ID ${id} no encontrado en comisiones`);
      }

      let newEdition = "Sin Cambios";
      let nuevaEdicion = comision.id_edicion;
      if (edition) {
        let edicion;
        if (Number.isInteger(edition)) {
          edicion = await Edicion.findByPk(edition);
        } else {
          edicion = await Edicion.findOne({ where: { nombre: edition } });
        }

        if (!edicion) {
          throw new Error(`ID ${edition} no encontrado en ediciones`);
        }

        newEdition = edicion.nombre;
        nuevaEdicion = edicion.id_edicion;
      }

      await comision.update({
        nombre: name,
        id_edicion: nuevaEdicion,
        presidente: president,
        secretario: secretary,
      });

      if (countries.length !== 0) {
        await Comision_Pais.destroy({ where: { id_comision: id } });
      }

      const result = new List<ICommissionElement>();
      for (let c of countries) {
        const country = await Pais.findByPk(c);

        if (!country) {
          throw new Error(`ID ${c} no encontrado en los Paises`);
        }

        await Comision_Pais.create({
          id_comision: id,
          id_pais: c,
        });

        const deputy = await Representante.findOne({
          where: { id_pais: c, estado: true },
          order: [["f_registro", "DESC"]],
        });

        if (!deputy) {
          throw new Error("Bad Deputy");
        }

        const element = {
          id: country.id_pais,
          name: country.nombre,
          deputy: `${deputy.p_nombre} ${deputy.p_apellido}`,
        };

        result.add(element);
      }

      return {
        success: true,
        message: `Comisión ${comision.nombre} actualizada con éxito`,
        name: comision.nombre,
        edition: newEdition,
        id_commission: id,
        numOfCountries: result.elements.length,
        countries: result.elements,
      };
    } catch (error: any) {
      console.error("Error en servicio de comisiones:", error);

      throw error;
    }
  }

  async deleteCommissionService(id: number): Promise<IGeneralResponse> {
    try {
      await Comision.destroy({ where: { id_comision: id } });
      await Comision_Pais.destroy({ where: { id_comision: id } });

      const response = new GeneralResponse(
        true,
        `Comision con ID ${id} eliminada con éxito`
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de eliminación:", error);

      throw error;
    }
  }

  async listCommissionsService(
    page: number = 1,
    email: string,
    roleName: string,
    limit: number = 10
  ): Promise<{
    commissions: ICommission[];
    paginated: IPaginated;
    totalCountries: number;
    totalVoting: number;
  }> {
    try {
      const offset = calcularOffset(page, limit);

      let options = {};

      if (roleName !== "Administrador") {
        const representante = await Representante.findByPk(email);

        const comisiones = await Comision_Pais.findAll({
          where: { id_pais: representante?.id_pais },
        });

        options = {
          where: {
            [Op.or]: [
              // Debe ser un array de condiciones
              { presidente: representante?.correo },
              { secretario: representante?.correo },
              {
                id_comision: {
                  [Op.in]: comisiones.map((e) => {
                    return e.id_comision;
                  }),
                },
              },
            ],
          },
        };
      }

      const comision = await Comision.findAndCountAll({
        limit,
        offset,
        order: [
          ["nombre", "ASC"],
          ["id_comision", "ASC"],
        ],
        ...options,
      });

      let totalCountries = 0;
      let totalVoting = 0;
      const result = new List<ICommission>();
      for (let elem of comision.rows) {
        if (!elem) {
          throw new Error("Bad, Error");
        }
        const correlacion = new List<ICommissionElement>();
        const relaciones = await Comision_Pais.findAll({
          where: { id_comision: elem.id_comision },
        });

        for (let c of relaciones) {
          const pais = await Pais.findByPk(c.id_pais);
          if (!pais) {
            throw new Error("Bad Country");
          }

          const deputy = await Representante.findOne({
            where: { id_pais: pais.id_pais, estado: true },
            order: [["f_registro", "DESC"]],
          });

          const country = {
            id: pais.id_pais,
            name: pais.nombre,
            deputy: deputy
              ? `${deputy.p_nombre} ${deputy.p_apellido}`
              : `Not Found for ${pais.nombre}`,
          };

          correlacion.add(country);
        }

        const edicion = await Edicion.findByPk(elem.id_edicion);
        if (!edicion) {
          throw new Error("BAD Edition");
        }

        const votes = await Votacion.count({
          where: { id_comision: elem.id_comision },
        });

        const commission = await Comision.findOne({
          where: {
            id_comision: elem.id_comision,
          },
        });

        if (!commission) {
          throw new Error(`Bad Error for Commission ${elem.nombre}`);
        }

        const president = await Representante.findOne({
          where: { usuario: commission.presidente },
        });
        const secretary = await Representante.findOne({
          where: { usuario: commission.secretario },
        });

        const response = {
          success: true,
          id_commission: elem.id_comision,
          name: elem.nombre,
          edition: edicion.nombre,
          votes: votes,
          president: president
            ? `${president.p_nombre} ${president.p_apellido}`
            : "Not Found",
          presidentUserName: president?.usuario,
          secretary: secretary
            ? `${secretary.p_nombre} ${secretary.p_apellido}`
            : "Not Found",
          secretaryUserName: secretary?.usuario,
          numOfCountries: correlacion.elements.length,
          countries: correlacion.elements,
        };
        //Sumar la cantidad de paises asociados
        totalCountries += correlacion.elements.length;
        totalVoting += votes;
        result.add(response);
      }

      const { totalPages, totalRecords } = calcularPaginas(
        comision.count,
        limit
      );
      const paginated = new GeneralPaginated(totalPages, totalRecords, page);

      return {
        commissions: result.elements,
        paginated: paginated.data,
        totalCountries,
        totalVoting,
      };
    } catch (error: any) {
      console.error("Error en servicio de listar comisiones:", error);

      throw error;
    }
  }
}
