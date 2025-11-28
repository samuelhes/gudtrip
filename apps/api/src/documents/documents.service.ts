import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus, DocumentType } from './entities/document.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private documentsRepository: Repository<Document>,
    ) { }

    async upload(user: User, type: DocumentType, url: string) {
        const document = this.documentsRepository.create({
            user,
            user_id: user.id,
            type,
            front_image_url: url, // Assuming single image for now or front
            status: DocumentStatus.PENDING,
        });
        return this.documentsRepository.save(document);
    }

    async findAllPending() {
        return this.documentsRepository.find({
            where: { status: DocumentStatus.PENDING },
            relations: ['user'],
            order: { created_at: 'ASC' },
        });
    }

    async verify(id: string, status: DocumentStatus, adminId: string, rejectionReason?: string) {
        const document = await this.documentsRepository.findOne({ where: { id } });
        if (!document) throw new NotFoundException('Document not found');

        document.status = status;
        document.reviewed_by_admin_id = adminId;
        document.reviewed_at = new Date();
        if (rejectionReason) {
            document.reject_reason = rejectionReason;
        }

        return this.documentsRepository.save(document);
    }
}
