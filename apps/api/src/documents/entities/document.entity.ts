import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DocumentType {
    LICENSE = 'LICENSE',
    PADRON = 'PADRON', // Vehicle registration
}

export enum DocumentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column({ type: 'enum', enum: DocumentType })
    type: DocumentType;

    @Column()
    front_image_url: string;

    @Column({ nullable: true })
    back_image_url: string;

    @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
    status: DocumentStatus;

    @Column({ nullable: true })
    reviewed_by_admin_id: string;

    @Column({ nullable: true })
    reviewed_at: Date;

    @Column({ nullable: true })
    reject_reason: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
