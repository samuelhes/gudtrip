import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentStatus, DocumentType } from './entities/document.entity';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    upload(@Body() body: { type: DocumentType; url: string }, @Request() req: any) {
        return this.documentsService.upload(req.user, body.type, body.url);
    }

    @Get('pending')
    // TODO: Add AdminGuard
    findAllPending() {
        return this.documentsService.findAllPending();
    }

    @Patch(':id/verify')
    // TODO: Add AdminGuard
    verify(@Param('id') id: string, @Body() body: { status: DocumentStatus; rejectionReason?: string }, @Request() req: any) {
        return this.documentsService.verify(id, body.status, req.user.id, body.rejectionReason);
    }
}
