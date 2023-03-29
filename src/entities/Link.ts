import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './User';

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

    @ManyToOne(() => User, (user) => user.userId)
    @JoinColumn()
    user: Relation<User>;
}