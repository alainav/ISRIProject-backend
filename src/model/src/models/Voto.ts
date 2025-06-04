import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";
import Votacion from "./Votacion.js";

class Voto extends Model<InferAttributes<Voto>, InferCreationAttributes<Voto>> {
  "id_voto"?: number;
  "a_favor": boolean;
  "en_contra": boolean;
  "abstencion": boolean;
  "id_votacion": number;
  "id_pais": number;
}

Voto.init(
  {
    id_voto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    a_favor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    en_contra: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    abstencion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    id_votacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Votos",
    tableName: "votos",
    timestamps: false,
  }
);

Voto.belongsTo(Votacion, { foreignKey: "id_votacion", onDelete: "CASCADE" });
Votacion.hasMany(Voto, {
  foreignKey: "id_votacion",
  onDelete: "CASCADE",
});

export default Voto;
