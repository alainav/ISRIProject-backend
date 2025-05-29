import { Entity, PrimaryGeneratedColumn, Column , BaseEntity , OneToMany} from "typeorm";
import { 
  IsString, 
  Length, 
  IsDate, 
  IsInt, 
  Min, 
  Max,
  IsNotEmpty
} from "class-validator";
import { Comision } from "./Comision.js";

@Entity()
export class Edicion extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'int' })
    id_edicion!: number;

    @Column({ type: 'varchar', length: 100 })
    @IsString({ message: "El nombre debe ser texto válido" })
    @Length(5, 100, { message: "Nombre requiere 5-100 caracteres" })
    @IsNotEmpty()
    nombre!: string;

    @Column({ type: 'date' })
    @IsDate()
    f_inicio!: Date;
    
    @Column({ type: 'date' })
    @IsDate()
    f_fin!: Date;
    
    @Column({ type: 'int' })
    @IsInt()
    @Min(1, { message: "Duración mínima: 1 día" })
    @Max(365, { message: "Duración máxima: 1 año" })
    duracion!: number;

     // Relación 1:N con Comision
     @OneToMany(() => Comision, comision => comision.edicion)
     comisiones!: Comision[];
}