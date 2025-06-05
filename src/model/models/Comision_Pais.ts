import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";
import Pais from "./Pais.js";
import Votacion from "./Votacion.js";
import Representante from "./Representante.js";
import Edicion from "./Edicion.js";

class Comision_Pais extends Model<
  InferAttributes<Comision_Pais>,
  InferCreationAttributes<Comision_Pais>
> {
  "id"?: number;
  "id_comision": number;
  "id_pais": number;
}

Comision_Pais.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_comision: {
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
    modelName: "Comision_Pais",
    tableName: "comision_pais",
    timestamps: false,
  }
);

export default Comision_Pais;
