import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";
import Representante from "./Representante.js";

class Rol extends Model<InferAttributes<Rol>, InferCreationAttributes<Rol>> {
  "id_rol": number;
  "nombre": string;
}

Rol.init(
  {
    id_rol: { primaryKey: true, type: DataTypes.INTEGER, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, modelName: "Rol", tableName: "roles", timestamps: false }
);

Rol.hasMany(Representante, { foreignKey: "id_rol" });
Representante.belongsTo(Rol, {
  foreignKey: "id_rol",
});

export default Rol;
