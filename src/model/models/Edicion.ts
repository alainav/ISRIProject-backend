import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";
import Comision from "./Comision.js";

class Edicion extends Model<
  InferAttributes<Edicion>,
  InferCreationAttributes<Edicion>
> {
  "id_edicion"?: number;
  "nombre": string;
  "f_inicio": Date;
  "f_fin": Date;
  "duracion": number;
}

Edicion.init(
  {
    id_edicion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    f_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    f_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "La duración mínima es 1" },
        max: { args: [365], msg: "La duración máxima es 365" },
      },
    },
  },
  {
    sequelize,
    modelName: "Edicion",
    tableName: "ediciones",
    timestamps: false,
  }
);

export default Edicion;
