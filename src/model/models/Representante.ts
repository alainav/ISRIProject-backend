import {
  Model,
  DataTypes,
  Optional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config/databaseConection.js";

class Representante extends Model<
  InferAttributes<Representante>,
  InferCreationAttributes<Representante>
> {
  "correo": string;
  "usuario": string;
  "p_nombre": string;
  "s_nombre": string | null;
  "p_apellido": string;
  "s_apellido": string;
  "c_acceso": number;
  "f_registro": Date;
  "f_expiracion": Date | null;
  "estado": boolean;
  "id_rol": number;
  "id_pais": number;
}

Representante.init(
  {
    correo: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
      validate: {
        isEmail: { msg: "Debe ser un correo electrónico válido" },
      },
    },
    usuario: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [5, 50],
          msg: "El usuario debe tener entre 5 y 50 caracteres",
        },
      },
    },
    p_nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El primer nombre es obligatorio" },
      },
    },
    s_nombre: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    p_apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El primer apellido es obligatorio" },
      },
    },
    s_apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    c_acceso: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "La clave debe tener mínimo 8 caracteres",
        },
      },
    },
    f_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    f_expiracion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    id_rol: {
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
    modelName: "Representante",
    tableName: "representantes",
    timestamps: false,
  }
);

export default Representante;
