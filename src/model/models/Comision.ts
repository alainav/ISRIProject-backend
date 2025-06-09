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
import Comision_Pais from "./Comision_Pais.js";

class Comision extends Model<
  InferAttributes<Comision>,
  InferCreationAttributes<Comision>
> {
  "id_comision"?: number;
  "nombre": string;
  "id_edicion"?: number;
  "presidente": string;
  "secretario": string;
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
    id_edicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    presidente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secretario: {
      type: DataTypes.STRING,
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
  foreignKey: "correo",
  as: "id_president",
});
Representante.hasOne(Comision, {
  foreignKey: "correo",
  as: "id_president",
});

Comision.hasMany(Representante, {
  foreignKey: "correo",
  as: "id_secretary",
});
Representante.hasOne(Comision, {
  foreignKey: "correo",
  as: "id_secretary",
});

export default Comision;
