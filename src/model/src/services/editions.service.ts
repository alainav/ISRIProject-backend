import { List } from "../../../utils/List.js";
import {
  calcularOffset,
  calcularPaginas,
  milisecondsToDays,
} from "../../../utils/utils.js";
import { IEditionsRequest } from "../interfaces/IEditionsRequest.js";
import { IEditionsResponse } from "../interfaces/IEditionsResponse.js";
import { IGeneralResponse } from "../interfaces/IGeneralResponse.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import Edicion from "../models/Edicion.js";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";

export class EditionService {
  async registerEditionService(
    data: IEditionsRequest
  ): Promise<IEditionsResponse> {
    try {
      const { name, initial_date, end_date } = data;

      const duracion = milisecondsToDays(
        new Date(end_date).getTime() - new Date(initial_date).getTime()
      );
      const edition = await Edicion.create({
        duracion,
        f_fin: end_date,
        f_inicio: initial_date,
        nombre: name,
      });

      return {
        id_edition: edition.id_edicion,
        duration: edition.duracion,
        end_date: edition.f_fin,
        initial_date: edition.f_inicio,
        name: edition.nombre,
        success: true,
      };
    } catch (error: any) {
      console.error("Error en servicio de registro de ediciones:", error);

      throw error;
    }
  }

  async updateEditionService(
    id: number,
    data: IEditionsRequest
  ): Promise<IEditionsResponse> {
    try {
      const { name, initial_date, end_date } = data;

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
            new Date(edition.f_fin).getTime() - new Date(initial_date).getTime()
          );
        }
      }
      await edition.update({
        duracion,
        f_fin: end_date,
        f_inicio: initial_date,
        nombre: name,
      });

      return {
        id_edition: edition.id_edicion,
        duration: edition.duracion,
        end_date: edition.f_fin,
        initial_date: edition.f_inicio,
        name: edition.nombre,
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
        order: [["f_inicio", "DESC"]],
      });

      const paginas = calcularPaginas(editions.count, 10);
      const paginated = new GeneralPaginated(
        paginas.totalPages,
        paginas.totalRecords,
        page
      );

      const preparedEditions = new PrepareListsEditions().prepare(
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
}

class PrepareListsEditions {
  editions: IEditionsResponse[] = [];

  prepare(editions: Edicion[]): IEditionsResponse[] {
    const listEditions = new List<IEditionsResponse>();
    for (let ed of editions) {
      //Necesario para construir el objeto
      const preparedEdition = {
        id_edition: ed.id_edicion,
        name: ed.nombre,
        initial_date: ed.f_inicio,
        end_date: ed.f_fin,
        duration: ed.duracion,
        success: true,
      };

      listEditions.add(preparedEdition);
    }

    return listEditions.elements;
  }
}
