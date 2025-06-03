import { IEditionsRequest } from "../interfaces/IEditionsRequest.js";
import { IEditionsResponse } from "../interfaces/IEditionsResponse.js";
import Edicion from "../models/Edicion.js";

export class EditionService {
  async registerEditionService(
    data: IEditionsRequest
  ): Promise<IEditionsResponse> {
    try {
      const { name, initial_date, end_date, duration } = data;

      const edition = await Edicion.create({
        duracion: duration,
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
}
