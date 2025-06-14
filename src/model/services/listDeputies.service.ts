import { Op } from "sequelize";
import { calcularOffset, calcularPaginas } from "../../utils/utils.js";
import { IPaginated } from "../interfaces/IPaginated.js";
import { GeneralDeputy } from "../models/estandar/GeneralDeputy.js";
import { GeneralPaginated } from "../models/estandar/GeneralPaginated.js";
import { IDeputy } from "../models/interfaces/IDeputy.js";
import Pais from "../models/Pais.js";
import Representante from "../models/Representante.js";
import Rol from "../models/Rol.js";

export class ListDeputyService {
  async listAllDeputiesService(
    page: number = 1,
    roleName: string,
    userName: string
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> {
    const offset = calcularOffset(page, 10);

    let allDeputies;
    if (roleName === "Administrador") {
      allDeputies = await Representante.findAndCountAll({
        offset,
        limit: 10,
        /*where: {
        estado: true,
      },*/
      });
    } else {
      allDeputies = await Representante.findAndCountAll({
        offset,
        limit: 10,
        where: {
          usuario: userName,
        },
      });
    }

    const preparer = new PrepareListsDeputies();
    await preparer.prepare(allDeputies.rows);

    const { totalPages, totalRecords } = calcularPaginas(allDeputies.count, 10);
    const paginated = new GeneralPaginated(totalPages, totalRecords, page);

    return { deputies: preparer.deputies, paginated };
  }

  async listOnlyDeputiesService(
    page: number = 1
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> {
    return await this.findDeputies(page, [
      "Representante",
      "Miembro Observador",
    ]);
  }

  async listOnlyCommissionPresidentsService(
    page: number = 1
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> {
    return await this.findDeputies(page, [
      "Presidente de Comisión",
      "Presidente General",
    ]);
  }

  async listOnlyCommissionSecretariesService(
    page: number = 1
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> {
    return await this.findDeputies(page, [
      "Secretario de Comisión",
      "Secretario General",
    ]);
  }

  async listOnlyGeneralPresidentsService(
    page: number = 1
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> {
    return await this.findDeputies(page, ["Presidente General"]);
  }

  async listOnlyGeneralSecretariesService(
    page: number = 1
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> {
    return await this.findDeputies(page, ["Secretario General"]);
  }

  private findDeputies = async (
    page: number = 1,
    roleName: string[]
  ): Promise<{ deputies: IDeputy[]; paginated: IPaginated }> => {
    const offset = calcularOffset(page, 10);

    const rol = await Rol.findAll({
      where: { nombre: { [Op.in]: roleName } },
    });
    if (!rol) {
      throw new Error(`No se ha creado el rol ${roleName}`);
    }

    const onlyDeputies = await Representante.findAndCountAll({
      offset,
      limit: 10,
      where: {
        estado: true,
        id_rol: {
          [Op.in]: rol.map((e) => {
            return e.id_rol;
          }),
        },
      },
    });

    const preparer = new PrepareListsDeputies();
    await preparer.prepare(onlyDeputies.rows);

    const { totalPages, totalRecords } = calcularPaginas(
      onlyDeputies.count,
      10
    );
    const paginated = new GeneralPaginated(totalPages, totalRecords, page);

    return { deputies: preparer.deputies, paginated: paginated.data };
  };
}

class PrepareListsDeputies {
  deputies: IDeputy[] = [];

  async prepare(deputies: Representante[]) {
    for (let dep of deputies) {
      //Necesario para construir el objeto
      const name = {
        first_name: dep.p_nombre,
        second_name: dep.s_nombre,
        first_surname: dep.p_apellido,
        second_surname: dep.s_apellido,
        name: `${dep.p_nombre}${dep.s_nombre ? ` ${dep.s_nombre}` : ""} ${
          dep.p_apellido
        } ${dep.s_apellido}`,
      };
      //Necesario para construir el objeto de role
      const roleName = await Rol.findByPk(dep.id_rol);
      const role = {
        id: dep.id_rol,
        name: roleName?.nombre,
      };

      //Necesario para constuir el objeto country
      const countryName = await Pais.findByPk(dep.id_pais);
      const country = {
        id: dep.id_pais,
        name: countryName?.nombre,
      };

      const deputy = new GeneralDeputy(
        dep.usuario,
        dep.correo,
        name,
        role,
        country,
        dep.c_acceso,
        dep.estado ? "Activo" : "Inactivo",
        dep.f_registro,
        dep.f_expiracion
      );
      this.deputies.push(deputy.data);
    }
  }
}
