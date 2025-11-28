import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ride } from '../../rides/entities/ride.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Ride)
    @JoinColumn({ name: 'ride_id' })
    ride: Ride;

    @Column()
    ride_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reviewer_id' })
    reviewer: User;

    @Column()
    reviewer_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reviewee_id' })
    reviewee: User;

    @Column()
    reviewee_id: string;

    @Column({ type: 'int' })
    rating: number; // 1-5

    @Column({ nullable: true })
    comment: string;

    @CreateDateColumn()
    created_at: Date;
}
