import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
    private transporter: nodemailer.Transporter;

    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
        private configService: ConfigService
    ) {
        // For development, we can use Ethereal or just log to console if no creds are provided
        // In production, we would use real SMTP credentials
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST') || 'smtp.ethereal.email',
            port: parseInt(this.configService.get('SMTP_PORT')) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('SMTP_USER') || 'ethereal_user',
                pass: this.configService.get('SMTP_PASS') || 'ethereal_pass',
            },
        });
    }

    async sendBookingConfirmation(to: string, passengerName: string, rideDetails: any) {
        const subject = '¡Reserva Confirmada en Gudtrip!';
        const html = `
      <h1>Hola, ${passengerName}!</h1>
      <p>Tu reserva ha sido confirmada exitosamente.</p>
      <h2>Detalles del Viaje:</h2>
      <ul>
        <li><strong>Origen:</strong> ${rideDetails.origin}</li>
        <li><strong>Destino:</strong> ${rideDetails.destination}</li>
        <li><strong>Fecha:</strong> ${new Date(rideDetails.departure_time).toLocaleString()}</li>
        <li><strong>Conductor:</strong> ${rideDetails.driver.first_name} ${rideDetails.driver.last_name}</li>
        <li><strong>Precio Total:</strong> $${rideDetails.total_price} Tokens</li>
      </ul>
      <p>¡Buen viaje!</p>
    `;

        try {
            const info = await this.transporter.sendMail({
                from: '"Gudtrip" <no-reply@gudtrip.com>',
                to,
                subject,
                html,
            });
            this.logger.log(`Message sent: ${info.messageId}`);
            // Preview only available when sending through an Ethereal account
            this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        } catch (error) {
            this.logger.error('Error sending email:', error);
            // Don't throw error to avoid failing the booking transaction if email fails
        }
    }
    async sendMatchNotification(userId: string, ride: any) {
        // In a real app, we would fetch the user to get the email
        // For now, we'll just log it or send to a dummy email if we don't have the user object
        this.logger.log(`Sending match notification to user ${userId} for ride ${ride.id}`);
        // TODO: Implement actual email sending by fetching user email
        // const user = await this.usersRepository.findOne(userId);
        // if (user) {
        //     await this.transporter.sendMail({ ... });
        // }
    }

    async sendTripRequestNotification(driverId: string, passengerName: string, ride: any, bookingId: string) {
        this.logger.log(`Sending trip request notification to driver ${driverId} from ${passengerName} for ride ${ride.id}`);
        // In a real implementation, we would fetch the driver's email and send it.
        // For now, we log it. We should also persist an in-app notification if we had that system fully set up.
        // Let's assume we persist it via the repository if we want in-app notifications.
        const notification = this.notificationsRepository.create({
            user_id: driverId,
            message: `Solicitud de viaje: ${passengerName} quiere unirse a tu viaje a ${ride.destination}`,
            type: 'TRIP_REQUEST',
            data: { rideId: ride.id, passengerName, bookingId },
        });
        await this.notificationsRepository.save(notification);
    }

    async sendBookingRejection(to: string, passengerName: string, rideDetails: any) {
        const subject = 'Solicitud de Viaje Rechazada';
        const html = `
      <h1>Hola, ${passengerName}.</h1>
      <p>Lo sentimos, el conductor no ha podido aceptar tu solicitud para el viaje a ${rideDetails.destination}.</p>
      <p>No se te ha cobrado nada. Puedes buscar otro viaje.</p>
    `;
        try {
            await this.transporter.sendMail({
                from: '"Gudtrip" <no-reply@gudtrip.com>',
                to,
                subject,
                html,
            });
        } catch (error) {
            this.logger.error('Error sending rejection email:', error);
        }
    }
    async findAllForUser(userId: string) {
        return this.notificationsRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }

    async markAsRead(id: string, userId: string) {
        const notification = await this.notificationsRepository.findOne({ where: { id, user_id: userId } });
        if (!notification) {
            // throw new NotFoundException('Notification not found');
            return null;
        }
        notification.is_read = true;
        notification.read_at = new Date();
        return this.notificationsRepository.save(notification);
    }
}
