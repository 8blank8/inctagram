import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp without time zone' })
    createdAt: Date;

    @Column({ type: 'timestamp without time zone', nullable: true, default: null })
    updatedAt: Date | null;
}