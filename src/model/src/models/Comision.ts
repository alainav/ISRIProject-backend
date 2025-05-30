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

class Comision extends Model<
  InferAttributes<Comision>,
  InferCreationAttributes<Comision>
> {
  "id_comision": number;
  "nombre": string;
  "id_pais": number;
  "id_edicion": number;
}

Comision.init(
  {
    id_comision: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_edicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comision",
    tableName: "comisiones",
    timestamps: false,
  }
);

Comision.belongsTo(Pais, {
  foreignKey: "id_pais",
});

Pais.hasMany(Comision, {
  foreignKey: "id_pais",
  onDelete: "CASCADE",
});

Edicion.hasMany(Comision, { foreignKey: "id_edicion", onDelete: "CASCADE" });
Comision.belongsTo(Edicion, { foreignKey: "id_edicion", onDelete: "CASCADE" });

Comision.hasMany(Votacion, {
  foreignKey: "id_comision",
});
Votacion.belongsTo(Comision, {
  foreignKey: "id_comision",
  onDelete: "CASCADE",
});

Comision.hasMany(Representante, {
  foreignKey: "id_comision",
});
Representante.belongsTo(Comision, {
  foreignKey: "id_comision",
});

export default Comision;
