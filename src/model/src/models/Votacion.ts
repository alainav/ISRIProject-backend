import { Entity, PrimaryGeneratedColumn, Column , BaseEntity ,ManyToOne ,OneToMany} from "typeorm";
import { 
  IsString, 
  Length, 
  IsNotEmpty, 
  IsInt,
  Min,
  Max 
} from "class-validator";
import { Comision } from "./Comision.js";
import { Voto } from "./Voto.js";

@Entity()
export class Votacion extends BaseEntity{

    @PrimaryGeneratedColumn({ type: 'int' })
    id_votacion!: number;  // Corregido typo: id_vatacion -> id_votacion

    @Column({ type: 'varchar', length: 100 })
    @IsString({ message: "El nombre debe ser un texto válido" })
    @Length(5, 100, { message: "El nombre debe tener entre 5 y 100 caracteres" })
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    nombre!: string;  // Cambiado de String -> string

    @Column({ type: 'varchar', length: 500 })
    @IsString({ message: "La descripción debe ser un texto válido" })
    @Length(10, 500, { message: "La descripción debe tener entre 10 y 500 caracteres" })
    descripcion!: string;  // Cambiado de String -> string

    @Column({ type: 'int', unique: true })
    @IsInt({ message: "El resultado debe ser un número entero" })
    @Min(0, { message: "El resultado no puede ser negativo" })
    @Max(1000000, { message: "El resultado excede el límite permitido" })
    resultado!: number;

    // Relaciones
    @ManyToOne(() => Comision, comision => comision.votaciones)
    comision!: Comision;

    @OneToMany(() => Voto, voto => voto.votacion)
    votos!: Voto[];
}