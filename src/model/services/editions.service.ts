import { Op, Transaction } from "sequelize";
import { List } from "../../utils/List.js";
import {
  calcularOffset,
  calcularPaginas,
  getFechaCuba,
  getFechaCubaText,
  milisecondsToDays,
} from "../../utils/utils.js";
import { IEditionsRequest } from "../interfaces/IEditionsRequest.js";
import { IEditionsResponse } from "../interfaces/IEditionsResponse.js";
import { IGeneralResponse } from "../interfaces/IGeneralResponse.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import Comision from "../models/Comision.js";
import Edicion from "../models/Edicion.js";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";
import Representante from "../models/Representante.js";
import { CommissionServices } from "./commission.service.js";
import { sequelize } from "../config/databaseConection.js";
import moment from "moment";

export class EditionService {
  async registerEditionService(
    data: IEditionsRequest
  ): Promise<IEditionsResponse> {
    const transaction = await sequelize.transaction();
    try {
      const { name, initial_date, end_date, president, secretary } = data;

      const duracion = milisecondsToDays(
        new Date(end_date).getTime() - new Date(initial_date).getTime()
      );
      const edition = await Edicion.create(
        {
          duracion,
          f_fin: end_date,
          f_inicio: initial_date,
          nombre: name,
        },
        { transaction }
      );

      if (!edition) {
        throw new Error("Bad edition creation");
      }

      await transaction.commit();
      const commissionServices = new CommissionServices();
      await commissionServices.registerCommissionService({
        countries: [0],
        edition: edition.id_edicion,
        name: `Asamblea General (${edition.id_edicion})`,
        president,
        secretary,
      });

      const exitEdition = await new PrepareListsEditions().prepareUnique(
        edition
      );
      return {
        ...exitEdition,
        success: true,
      };
    } catch (error: any) {
      console.error("Error en servicio de registro de ediciones:", error);
      await transaction.rollback();
      throw error;
    }
  }

  async updateEditionService(
    id: number,
    data: IEditionsRequest
  ): Promise<IEditionsResponse> {
    try {
      const { name, initial_date, end_date, president, secretary } = data;

      const edition = await Edicion.findByPk(id);
      if (!edition) {
        throw new Error(`ID ${id} no encontrado en ediciones`);
      }

      let duracion;
      if (initial_date || end_date) {
        if (initial_date && !end_date) {
          duracion = milisecondsToDays(
            new Date(edition.f_fin).getTime() - new Date(initial_date).getTime()
          );
        } else if (!initial_date && end_date) {
          duracion = milisecondsToDays(
            new Date(end_date).getTime() - new Date(edition.f_inicio).getTime()
          );
        } else {
          duracion = milisecondsToDays(
            new Date(end_date).getTime() - new Date(initial_date).getTime()
          );
        }
      }
      await edition.update({
        duracion,
        f_fin: end_date,
        f_inicio: initial_date,
        nombre: name,
      });

      if (president || secretary) {
        const commission = await Comision.findOne({
          where: {
            id_edicion: edition.id_edicion,
            nombre: `Asamblea General (${edition.id_edicion})`,
          },
        });

        if (!commission) {
          throw new Error("Bad Error, Not Commission Found");
        }

        await commission.update({
          presidente: president,
          secretario: secretary,
        });
      }

      const exitEdition = await new PrepareListsEditions().prepareUnique(
        edition
      );

      return {
        ...exitEdition,
        success: true,
        message: `Edición ${edition.nombre} modificada`,
      };
    } catch (error: any) {
      console.error("Error en servicio de actualizar de ediciones:", error);

      throw error;
    }
  }

  async deleteEditionService(id: number): Promise<IGeneralResponse> {
    try {
      await Edicion.destroy({ where: { id_edicion: id } });
      await Comision.destroy({ where: { id_edicion: id } });

      return {
        success: true,
        message: `Edición ${id} eliminada`,
      };
    } catch (error: any) {
      console.error("Error en servicio de actualizar de ediciones:", error);

      throw error;
    }
  }

  async listEditionService(page: number = 1): Promise<{
    editions: IEditionsResponse[];
    paginated: IPaginated;
    success: boolean;
  }> {
    try {
      const offset = calcularOffset(page, 10);
      const editions = await Edicion.findAndCountAll({
        offset,
        limit: 10,
        order: [
          ["f_inicio", "ASC"],
          ["f_fin", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const paginas = calcularPaginas(editions.count, 10);
      const paginated = new GeneralPaginated(
        paginas.totalPages,
        paginas.totalRecords,
        page
      );

      const preparedEditions = await new PrepareListsEditions().prepare(
        editions.rows
      );
      return {
        editions: preparedEditions,
        paginated: paginated,
        success: true,
      };
    } catch (error: any) {
      console.error("Error en servicio de listar ediciones:", error);

      throw error;
    }
  }

  async listEditionActiveService(): Promise<{
    editions: IEditionsResponse[];
    success: boolean;
  }> {
    try {
      const editions = await Edicion.findAndCountAll({
        order: [
          ["f_fin", "DESC"],
          ["f_inicio", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const preparedEditions = await new PrepareListsEditions().prepare(
        editions.rows
      );
      return {
        editions: preparedEditions,
        success: true,
      };
    } catch (error: any) {
      console.error("Error en servicio de listar ediciones:", error);

      throw error;
    }
  }
}

class PrepareListsEditions {
  editions: IEditionsResponse[] = [];

  async prepare(editions: Edicion[]): Promise<IEditionsResponse[]> {
    const listEditions = new List<IEditionsResponse>();
    for (let ed of editions) {
      //Necesario para construir el objeto
      const preparedEdition = await this.prepareUnique(ed);

      listEditions.add(preparedEdition);
    }

    return listEditions.elements;
  }

  async prepareUnique(edition: Edicion): Promise<IEditionsResponse> {
    const commission = await Comision.findOne({
      where: {
        id_edicion: edition.id_edicion,
        nombre: `Asamblea General (${edition.id_edicion})`,
      },
    });

    let president, secretary;
    if (commission) {
      president = await Representante.findOne({
        where: { usuario: commission.presidente },
      });
      secretary = await Representante.findOne({
        where: { usuario: commission.secretario },
      });
    }
    //Necesario para construir el objeto
    const preparedEdition = {
      id_edition: edition.id_edicion,
      name: edition.nombre,
      initial_date: edition.f_inicio,
      end_date: moment(edition.f_fin, "YYYY/MM/DD").format("DD-MM-YYYY"),
      duration: edition.duracion,
      success: true,
      president: president
        ? `${president?.p_nombre} ${president?.p_apellido}`
        : "No encontrado",
      presidentUserName: president?.usuario,
      secretary: secretary
        ? `${secretary?.p_nombre} ${secretary?.p_apellido}`
        : "No encontrado",
      secretaryUserName: secretary?.usuario,
      cubaDate: getFechaCubaText(),
    };

    return preparedEdition;
  }
}
