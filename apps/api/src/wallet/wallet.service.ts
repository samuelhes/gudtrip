import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private dataSource: DataSource,
    ) { }

    async createWallet(user: User): Promise<Wallet> {
        const wallet = this.walletRepository.create({ user, user_id: user.id });
        return this.walletRepository.save(wallet);
    }

    async getBalance(userId: string): Promise<Wallet> {
        let wallet = await this.walletRepository.findOne({ where: { user_id: userId } });
        if (!wallet) {
            // Auto-create wallet if not exists (simplification for prototype)
            const user = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });
            if (user) {
                wallet = await this.createWallet(user);
            } else {
                throw new BadRequestException('User not found');
            }
        }
        return wallet;
    }

    async addFunds(userId: string, amount: number): Promise<Wallet> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let wallet = await this.walletRepository.findOne({ where: { user_id: userId } });
            if (!wallet) {
                // Should ideally exist, but handling just in case
                const user = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });
                if (!user) throw new BadRequestException('User not found');
                wallet = this.walletRepository.create({ user, user_id: user.id });
                await queryRunner.manager.save(wallet);
            }

            wallet.balance = Number(wallet.balance) + Number(amount);
            await queryRunner.manager.save(wallet);

            const transaction = this.transactionRepository.create({
                wallet,
                wallet_id: wallet.id,
                type: TransactionType.DEPOSIT,
                amount,
                description: 'Deposit funds',
            });
            await queryRunner.manager.save(transaction);

            await queryRunner.commitTransaction();
            return wallet;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
