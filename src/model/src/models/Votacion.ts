import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";
import Comision from "./Comision.js";
import Voto from "./Voto.js";

class Votacion extends Model<
  InferAttributes<Votacion>,
  InferCreationAttributes<Votacion>
> {
  "id_votacion": number;
  "nombre": string;
  "description": string;
  "resultado": number;
}

Votacion.init(
  {
    id_votacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resultado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "votaciones",
    modelName: "Votacion",
    timestamps: false,
  }
);

export default Votacion;
