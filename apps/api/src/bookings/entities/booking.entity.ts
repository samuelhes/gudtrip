import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ride } from '../../rides/entities/ride.entity';

export enum BookingStatus {
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Ride)
    @JoinColumn({ name: 'ride_id' })
    ride: Ride;

    @Column()
    ride_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'passenger_id' })
    passenger: User;

    @Column()
    passenger_id: string;

    @Column({ type: 'int' })
    seats_booked: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
    status: BookingStatus;

    @CreateDateColumn()
    created_at: Date;
}
