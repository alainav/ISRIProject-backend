import { Entity, PrimaryGeneratedColumn, Column , BaseEntity,OneToMany} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Representante } from "./Representante.js";

@Entity()
export class Rol extends BaseEntity{
    @PrimaryGeneratedColumn({ type: 'int' })
    id !: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    @Length(3, 50, { message: "El nombre del rol debe tener entre 3 y 50 caracteres." })
    @IsNotEmpty({ message: "El nombre del rol no puede estar vacío." })
    nombre!: string;

    // Relación 1:N con Representante
    @OneToMany(() => Representante, representante => representante.rol)
    representantes!: Representante[];
}