import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";

class Votacion extends Model<
  InferAttributes<Votacion>,
  InferCreationAttributes<Votacion>
> {
  "id_votacion"?: number;
  "nombre": string;
  "description": string;
  "resultado":
    | "Programada"
    | "Aprobada"
    | "Denegada"
    | "Sin Decisión"
    | "Activa";
  "id_comision": number;
  "abstencion"?: number;
  "en_contra"?: number;
  "a_favor"?: number;
  "estado": "Abierta" | "Cerrada";
  "fecha"?: Date;
  "hora"?: string;
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
    id_comision: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resultado: {
      type: DataTypes.STRING,
      defaultValue: "No Iniciada",
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "Cerrada",
    },
    fecha: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
    },
    hora: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    a_favor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    en_contra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    abstencion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
