import { List } from "../../utils/List.js";
import {
  calcularOffset,
  calcularPaginas,
  getFechaCuba,
  getHoraCubaText,
} from "../../utils/utils.js";
import { IGeneralResponse } from "../interfaces/IGeneralResponse.js";
import Comision from "../models/Comision.js";
import Comision_Pais from "../models/Comision_Pais.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import Pais from "../models/Pais.js";
import Representante from "../models/Representante.js";
import { Op } from "sequelize";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import { IVotingRequest } from "../interfaces/IVotingRequest.js";
import Votacion from "../models/Votacion.js";
import { IVotingResponse } from "../interfaces/IVotingResponse.js";
import Voto from "../models/Voto.js";
import { IVoting } from "../models/interfaces/IVoting.js";
import { IVote } from "../models/interfaces/IVote.js";

export class VotingService {
  async registerVotingService(data: IVotingRequest): Promise<IVotingResponse> {
    try {
      const { voting_name, voting_description, commission } = data;

      const comision = await Comision.findByPk(commission);

      if (!comision) {
        throw new Error("Bad Error, exist not the commission");
      }

      const votacion = await Votacion.create({
        nombre: voting_name,
        description: voting_description,
        id_comision: commission,
        resultado: "Programada",
        estado: "Cerrada",
      });

      return {
        success: true,
        message: "Votación agregada con éxito",
        voting_name: votacion.nombre,
        description: votacion.description,
        commission_name: comision.nombre,
        abstention: 0,
        against: 0,
        in_favour: 0,
        id_voting: votacion.id_votacion,
        result: "Programada",
        state: "Cerrada",
      };
    } catch (error: any) {
      console.error("Error al crear Votación:", error);

      throw error;
    }
  }

  async updateVotingService(
    id: number,
    data: IVotingRequest
  ): Promise<IVotingResponse> {
    try {
      const { voting_name, voting_description, commission } = data;

      const votacion = await Votacion.findByPk(id);

      if (!votacion) {
        throw new Error(`Votacion ${id} no encontrada en las votaciones`);
      }
      const comision = await Comision.findByPk(votacion.id_comision);

      if (!comision) {
        throw new Error("Bad Error, exist not the commission");
      }

      await votacion.update({
        nombre: voting_name,
        description: voting_description,
        id_comision: commission,
      });

      return {
        success: true,
        message: "Votación actualizada con éxito",
        voting_name: votacion.nombre,
        description: votacion.description,
        commission_name: comision.nombre,
        abstention: votacion.abstencion,
        against: votacion.en_contra,
        in_favour: votacion.a_favor,
        id_voting: votacion.id_votacion,
        result: votacion.resultado,
        state: votacion.estado,
      };
    } catch (error: any) {
      console.error("Error al actualizar la Votación:", error);

      throw error;
    }
  }

  async deleteVotingService(id: number): Promise<IGeneralResponse> {
    try {
      await Votacion.destroy({ where: { id_votacion: id } });
      await Voto.destroy({ where: { id_votacion: id } });

      const response = new GeneralResponse(
        true,
        `Votación con ID ${id} eliminada con éxito`
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de eliminación:", error);

      throw error;
    }
  }

  async listVotingsService(
    page: number = 1,
    email: string
  ): Promise<{ votings: IVoting[]; paginated: IPaginated }> {
    try {
      const offset = calcularOffset(page, 10);

      const representante = await Representante.findByPk(email);

      if (!representante) {
        throw new Error(`Correo ${email} no encontrado.`);
      }
      const paises = await Comision_Pais.findAll({
        where: { id_pais: representante.id_pais },
      });

      const votaciones = await Votacion.findAndCountAll({
        limit: 10,
        offset,
        where: {
          id_comision: {
            [Op.in]: paises.map((e) => {
              return e.id_comision;
            }),
          },
        },
      });

      const result = new List<IVoting>();
      for (let elem of votaciones.rows) {
        if (!elem) {
          throw new Error("Bad, Error");
        }

        const comision = await Comision.findByPk(elem.id_comision);
        const countCountries = await Comision_Pais.count({
          where: { id_comision: elem.id_comision },
        });

        if (!comision) {
          throw new Error("Bad, Error");
        }

        const adding = {
          id_voting: elem.id_votacion,
          voting_name: elem.nombre,
          description: elem.description,
          result: elem.resultado,
          commission_name: comision.nombre,
          in_favour: elem.a_favor || 0,
          against: elem.en_contra || 0,
          abstention: elem.abstencion || 0,
          totalVotes:
            (elem.abstencion || 0) +
            (elem.en_contra || 0) +
            (elem.a_favor || 0),
          state: elem.estado,
          totalParticipants: countCountries,
          date: elem.fecha,
          hour: elem.hora,
        };

        result.add(adding);
      }

      const { totalPages, totalRecords } = calcularPaginas(
        votaciones.count,
        10
      );
      const paginated = new GeneralPaginated(totalPages, totalRecords, page);

      return { votings: result.elements, paginated: paginated.data };
    } catch (error: any) {
      console.error("Error en servicio de listar votaciones:", error);

      throw error;
    }
  }

  async changeStatusVotingService(id: number): Promise<IGeneralResponse> {
    try {
      const votacion = await Votacion.findByPk(id);

      if (!votacion) {
        throw new Error(`Votación ${id} no encontrada`);
      }

      let estado: "Abierta" | "Cerrada";
      if (votacion.estado === "Cerrada") {
        estado = "Abierta";
        await votacion.update({
          estado,
          resultado: "Activa",
          fecha: getFechaCuba(),
        });
      } else {
        estado = "Cerrada";
        let resultado:
          | "No iniciada"
          | "Aprobada"
          | "Denegada"
          | "Sin Decisión"
          | "En proceso";

        let { aFavor, enContra, abstencion } = await this.contarVotos(id);

        const totalPaises = await Comision_Pais.count({
          where: { id_comision: votacion.id_comision },
        });

        abstencion = totalPaises - (aFavor + enContra + abstencion);

        await votacion.update({
          a_favor: aFavor,
          en_contra: enContra,
          abstencion: abstencion,
        });

        if (aFavor > enContra && aFavor > abstencion) {
          resultado = "Aprobada";
        } else if (enContra > aFavor && enContra > abstencion) {
          resultado = "Denegada";
        } else {
          resultado = "Sin Decisión";
        }

        await votacion.update({
          estado: "Cerrada",
          resultado,
          hora: getHoraCubaText(),
        });
      }

      const response = new GeneralResponse(
        true,
        `Votación con ID ${id} ${estado} con éxito`
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error(
        "Error en servicio de cambio de estado de votación:",
        error
      );

      throw error;
    }
  }

  async executeVoteService(
    id: number,
    country: number,
    voto: number
  ): Promise<IGeneralResponse> {
    try {
      const votacion = await Votacion.findByPk(id);

      if (!votacion) {
        throw new Error(`Votación ${id} no encontrada`);
      }

      if (votacion.fecha === null) {
        throw new Error(`Operación Inválida. Votación ${id} cerrada`);
      }

      const votada = await Voto.findOne({
        where: { id_pais: country, id_votacion: id },
      });

      if (votada) {
        let v: string;
        if (votada.a_favor) {
          v = "A Favor";
        } else if (votada.en_contra) {
          v = "En Contra";
        } else {
          v = "de Abstención";
        }
        throw new Error(`Voto ${v} ejercido previamente`);
      }

      const pais = await Pais.findByPk(country);

      let vote: string;
      switch (voto) {
        case 0:
          vote = "En Contra";
          await Voto.create({
            id_pais: country,
            id_votacion: id,
            a_favor: false,
            abstencion: false,
            en_contra: true,
          });
          break;

        case 1:
          vote = "A Favor";
          await Voto.create({
            id_pais: country,
            id_votacion: id,
            a_favor: true,
            abstencion: false,
            en_contra: false,
          });
          break;
        default:
          vote = "de Abstención";
          await Voto.create({
            id_pais: country,
            id_votacion: id,
            a_favor: false,
            abstencion: true,
            en_contra: false,
          });
          break;
      }

      const { aFavor, enContra, abstencion } = await this.contarVotos(id);

      await votacion.update({
        a_favor: aFavor,
        en_contra: enContra,
        abstencion,
      });

      const paises = await Comision_Pais.findAll({
        where: {
          id_comision: votacion.id_comision,
        },
      });

      const countries = paises.map(async (p) => {
        const pais = await Pais.findByPk(p.id_pais);
        if (!pais) {
          throw new Error("BAD ERROR, found not country");
        }
        return pais.nombre;
      });

      if (paises.length === aFavor + enContra + abstencion) {
        this.changeStatusVotingService(id);
      }

      const response = new GeneralResponse(
        true,
        `Voto ${vote} ejecutado por ${pais?.nombre}`,
        undefined,
        await Promise.all(countries)
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de ejecucion de voto:", error);

      throw error;
    }
  }

  async showMonitorService(id: number): Promise<{
    votes: IVote[];
    success: boolean;
    in_favour: number;
    against: number;
    abstention: number;
    auxData?: any;
  }> {
    try {
      const votacion = await Votacion.findByPk(id);

      if (!votacion) {
        throw new Error(`Votación ${id} no encontrada`);
      }

      const pais = await Comision_Pais.findAll({
        where: { id_comision: votacion.id_comision },
        include: {
          model: Pais,
        },
        order: [[Pais, "nombre", "ASC"]],
      });

      let aFavor = 0;
      let enContra = 0;
      let abstencion = 0;
      const lista = new List<IVote>();
      for (let p of pais) {
        const v = await Voto.findOne({
          where: { id_pais: p.id_pais, id_votacion: id },
        });

        let vote: number;

        if (!v) {
          vote = -1;
        } else if (v.a_favor) {
          vote = 1;
          aFavor++;
        } else if (v.en_contra) {
          vote = 0;
          enContra++;
        } else if (v.abstencion) {
          vote = 2;
          abstencion++;
        } else {
          vote = -1;
        }

        const pais = await Pais.findByPk(p.id_pais);

        if (!pais) {
          throw new Error("Bad Error, exists not that country");
        }

        const resultado = {
          country: pais.nombre,
          vote: vote,
        };

        lista.add(resultado);
      }

      const paises = await Comision_Pais.findAll({
        where: {
          id_comision: votacion.id_comision,
        },
      });

      const countries = paises.map(async (p) => {
        const pais = await Pais.findByPk(p.id_pais);
        if (!pais) {
          throw new Error("BAD ERROR, found not country");
        }
        return pais.nombre;
      });

      const auxData = await Promise.all(countries);

      // 5. Retornar respuesta
      return {
        votes: lista.elements,
        success: true,
        in_favour: aFavor,
        against: enContra,
        abstention: abstencion,
        auxData,
      };
    } catch (error: any) {
      console.error("Error en servicio de monitarizacion de votos:", error);

      throw error;
    }
  }

  private contarVotos = async (
    id: number
  ): Promise<{ aFavor: number; enContra: number; abstencion: number }> => {
    const aFavor = await Voto.count({
      where: { id_votacion: id, a_favor: true },
    });

    const enContra = await Voto.count({
      where: { id_votacion: id, en_contra: true },
    });

    const abstencion = await Voto.count({
      where: { id_votacion: id, abstencion: true },
    });

    return { aFavor, enContra, abstencion };
  };
}
