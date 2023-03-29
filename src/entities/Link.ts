import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    linkId: string;

    @Column()
    originalURL: string;

    @Column()
    numHits: number;

    @Column()
    lastAccessedOn: string;

}