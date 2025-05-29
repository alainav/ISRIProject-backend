import { Entity, PrimaryGeneratedColumn, Column , BaseEntity ,OneToOne ,OneToMany,JoinColumn} from "typeorm";
import { Length, IsNotEmpty, IsString } from "class-validator";
import { Comision } from "./Comision.js";
import { Representante } from "./Representante.js";
import { Voto } from "./Voto.js";

@Entity()
export class Pais extends BaseEntity{
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    @IsString({ message: "El nombre debe ser un texto" })
    @Length(4, 100, { message: "El nombre debe tener entre 4 y 100 caracteres" })
    @IsNotEmpty({ message: "El nombre no puede estar vacío" })
    nombre!: string;  // Cambiado de String -> string

    // Relaciones
    @OneToMany(() => Comision, comision => comision.pais)
    comisiones!: Comision[];

    @OneToOne(() => Representante, representante => representante.pais)
    @JoinColumn() // Esto hace que Pais sea el dueño de la relación
    representante!: Representante; // Singular porque es 1:1

    @OneToOne(() => Voto, voto => voto.pais)
    voto!: Voto;
}