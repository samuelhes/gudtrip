import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    PASSENGER = 'PASSENGER',
    DRIVER = 'DRIVER',
    ADMIN = 'ADMIN',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    BANNED = 'BANNED',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ type: 'simple-array', default: [UserRole.PASSENGER] })
    roles: UserRole[];

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ default: false })
    is_driver_requested: boolean;

    @Column({ default: false })
    is_driver_approved: boolean;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ type: 'float', default: 0 })
    average_rating: number;

    @Column({ type: 'int', default: 0 })
    total_reviews: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
