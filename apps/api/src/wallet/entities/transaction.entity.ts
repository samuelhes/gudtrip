import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
    RESERVATION = 'RESERVATION',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Wallet)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;

    @Column()
    wallet_id: string;

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;
}
