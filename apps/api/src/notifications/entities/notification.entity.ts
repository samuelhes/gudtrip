import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
    TRIP_MATCH_FOR_TRAVEL_NEED = 'TRIP_MATCH_FOR_TRAVEL_NEED',
    RESERVATION_REQUEST = 'RESERVATION_REQUEST',
    RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED',
    RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
    SYSTEM = 'SYSTEM',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column({ nullable: true })
    trip_id: string;

    @Column({ nullable: true })
    travel_need_id: string;

    @Column({ default: false })
    is_read: boolean;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: true })
    read_at: Date;
}
