import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
    private transporter: nodemailer.Transporter;

    private readonly logger = new Logger(NotificationsService.name);

    constructor(private configService: ConfigService) {
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
}
