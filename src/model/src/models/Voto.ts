import { Entity, PrimaryGeneratedColumn, Column , BaseEntity ,ManyToOne ,OneToOne } from "typeorm";
import { IsBoolean } from "class-validator";
import { Votacion } from "./Votacion.js";
import { Representante } from "./Representante.js";
import { Pais } from "./Pais.js";

@Entity()
export class Voto extends BaseEntity{

    @PrimaryGeneratedColumn({ type: 'int' })
    id_voto!: number;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    a_favor!: boolean;
    
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    en_contra!: boolean;
    
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    abstencion!: boolean;

    // Relaciones
    @ManyToOne(() => Votacion, votacion => votacion.votos)
    votacion!: Votacion;

    @ManyToOne(() => Representante, representante => representante.votos)
    representante!: Representante;

    @OneToOne(() => Pais, pais => pais.voto)
    pais!: Pais;
}
