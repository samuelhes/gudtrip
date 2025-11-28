import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TravelNeedStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    FULFILLED = 'FULFILLED'
}

@Entity('travel_needs')
export class TravelNeed {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column()
    origin_city: string;

    @Column()
    destination_city: string;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    start_block: number;

    @Column()
    end_block: number;

    @Column({ type: 'enum', enum: TravelNeedStatus, default: TravelNeedStatus.ACTIVE })
    status: TravelNeedStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
