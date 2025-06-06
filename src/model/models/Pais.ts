import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";
import Comision from "./Comision.js";
import Representante from "./Representante.js";
import Voto from "./Voto.js";
import Comision_Pais from "./Comision_Pais.js";

class Pais extends Model<InferAttributes<Pais>, InferCreationAttributes<Pais>> {
  "id_pais": number;
  "nombre": string;
}

Pais.init(
  {
    id_pais: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [4, 100],
          msg: "El nombre debe tener entre 4 y 100 caracteres",
        },
        notEmpty: {
          msg: "El nombre no puede estar vacío",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Pais",
    tableName: "paises",
    timestamps: false,
  }
);

Pais.hasMany(Representante, {
  foreignKey: "id_pais",
});

Pais.hasMany(Voto, {
  foreignKey: "id_pais",
});
Voto.belongsTo(Pais, { foreignKey: "id_pais" });

Representante.belongsTo(Pais, {
  foreignKey: "id_pais",
});

export default Pais;
