import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('rides')
export class Ride {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    origin: string;

    @Column()
    destination: string;

    @Column({ type: 'timestamp' })
    departure_time: Date;

    @Column()
    total_seats: number;

    @Column()
    available_seats: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price_tokens: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'driver_id' })
    driver: User;

    @Column()
    driver_id: string;

    @Column({ default: 'OPEN' }) // OPEN, FULL, COMPLETED, CANCELLED
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
