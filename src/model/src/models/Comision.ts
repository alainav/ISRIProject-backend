import { Entity, PrimaryGeneratedColumn, Column , BaseEntity ,ManyToOne ,OneToMany} from "typeorm";
import { Pais } from "./Pais.js";
import { Votacion } from "./Votacion.js";
import { Representante } from "./Representante.js";
import { Edicion } from "./Edicion.js";

@Entity() 
export class Comision extends BaseEntity{

    @PrimaryGeneratedColumn({type: 'int'}) // ID autoincremental
    id !: number;

    @Column({type: 'varchar'}) 
    nombre !: string;

    // Relaciones
    @ManyToOne(() => Pais, pais => pais.comisiones)
    pais!: Pais;

    @OneToMany(() => Votacion, votacion => votacion.comision)
    votaciones!: Votacion[];

    @OneToMany(() => Representante, representante => representante.comision)
    representantes!: Representante[];

    @ManyToOne(() => Edicion, edicion => edicion.comisiones)
    edicion!: Edicion;
}