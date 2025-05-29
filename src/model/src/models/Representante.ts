import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToOne,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import {
  IsEmail,
  Length,
  IsDate,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";
import { Rol } from "./Rol.js";
import { Comision } from "./Comision.js";
import { Voto } from "./Voto.js";
import { Pais } from "./Pais.js";

@Entity()
export class Representante extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 100 })
  @IsEmail({}, { message: "Debe ser un correo electrónico válido" })
  correo!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  @Length(5, 50, { message: "El usuario debe tener entre 5 y 50 caracteres" })
  usuario!: string;

  @Column({ type: "varchar", length: 50 })
  @IsNotEmpty({ message: "El primer nombre es obligatorio" })
  p_nombre!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  s_nombre!: string | null;

  @Column({ type: "varchar", length: 50 })
  @IsNotEmpty({ message: "El primer apellido es obligatorio" })
  p_apellido!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  s_apellido!: string | null;

  @Column({ type: "varchar", length: 100 })
  @Length(8, 100, { message: "La clave debe tener mínimo 8 caracteres" })
  c_acceso!: number;

  @Column({ type: "date" })
  @IsDate()
  f_registro!: Date;

  @Column({ type: "date" })
  @IsDate()
  f_expiracion!: Date;

  @Column({ type: "boolean", default: true })
  @IsBoolean()
  estado!: boolean;

  // Relaciones
  @ManyToOne(() => Rol, (rol) => rol.representantes)
  rol!: Rol;

  @ManyToOne(() => Comision, (comision) => comision.representantes, {
    nullable: true,
  })
  comision?: Comision;

  @OneToOne(() => Pais, (pais) => pais.representante)
  pais!: Pais;

  @OneToMany(() => Voto, (voto) => voto.representante)
  votos!: Voto[];
}
