import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class RegistrationEmailService {
  private readonly logger = new Logger(RegistrationEmailService.name);
  private transporter: Transporter | null = null;
  private disabledLogged = false;

  constructor(private readonly config: ConfigService) {}

  async sendRegistrationReceivedEmail(params: {
    participantName: string;
    participantEmail: string;
    eventName: string;
  }) {
    if (!params.participantEmail) {
      this.logger.warn('Registration email skipped because participant email is missing.');
      return;
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      return;
    }

    const from = this.config.get<string>('SMTP_FROM') || this.config.get<string>('SMTP_USER');
    const symposiumName = this.config.get<string>('SYMPOSIUM_NAME') || 'CYSTECH 2K26';
    const safeName = params.participantName || 'Participant';
    const safeEvent = params.eventName || 'your selected event';

    const textBody = [
      `Hi ${safeName},`,
      '',
      `Thank you for registering for ${safeEvent} at ${symposiumName}!`,
      '',
      'Your registration has been received and is currently pending admin review.',
      'You will receive another email once your payment is verified and your spot is confirmed.',
      '',
      'Regards,',
      `${symposiumName} Team`,
    ].join('\n');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 560px; margin: 0 auto;">
        <h2 style="margin: 0 0 12px; color: #0f172a;">Registration Received &#9203;</h2>
        <p style="margin: 0 0 12px;">Hi ${this.escapeHtml(safeName)},</p>
        <p style="margin: 0 0 12px;">Thank you for registering for <strong>${this.escapeHtml(safeEvent)}</strong> at <strong>${this.escapeHtml(symposiumName)}</strong>!</p>
        <div style="margin: 0 0 12px; padding: 12px; background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px;">
          <p style="margin: 0 0 6px;"><strong>Status:</strong> Pending Admin Review</p>
          <p style="margin: 0;">Your payment screenshot has been received. An admin will verify it shortly.</p>
        </div>
        <p style="margin: 0 0 12px;">You will receive another email once your registration is confirmed.</p>
        <p style="margin: 0;">Regards,<br/>${this.escapeHtml(symposiumName)} Team</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: params.participantEmail,
      subject: `${symposiumName}: Registration Received for ${safeEvent}`,
      text: textBody,
      html: htmlBody,
    });
  }

  async sendApprovalEmail(params: {
    participantName: string;
    participantEmail: string;
    eventName: string;
  }) {
    if (!params.participantEmail) {
      this.logger.warn('Approval email skipped because participant email is missing.');
      return;
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      return;
    }

    const from = this.config.get<string>('SMTP_FROM') || this.config.get<string>('SMTP_USER');
    const symposiumName = this.config.get<string>('SYMPOSIUM_NAME') || 'CYSTECH 2K26';
    const safeParticipantName = params.participantName || 'Participant';
    const safeEventName = params.eventName || 'your selected event';

    const textBody = [
      `Hi ${safeParticipantName},`,
      '',
      'Your registration has been approved by the admin team.',
      `Event: ${safeEventName}`,
      `Symposium: ${symposiumName}`,
      '',
      'You are now a confirmed participant.',
      'Please keep this email for your records.',
      '',
      `Regards,`,
      `${symposiumName} Team`,
    ].join('\n');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 560px; margin: 0 auto;">
        <h2 style="margin: 0 0 12px; color: #0f172a;">Registration Confirmed</h2>
        <p style="margin: 0 0 12px;">Hi ${this.escapeHtml(safeParticipantName)},</p>
        <p style="margin: 0 0 12px;">Your registration has been approved by the admin team.</p>
        <div style="margin: 0 0 12px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p style="margin: 0 0 6px;"><strong>Event:</strong> ${this.escapeHtml(safeEventName)}</p>
          <p style="margin: 0;"><strong>Symposium:</strong> ${this.escapeHtml(symposiumName)}</p>
        </div>
        <p style="margin: 0 0 12px;">You are now a confirmed participant.</p>
        <p style="margin: 0;">Regards,<br/>${this.escapeHtml(symposiumName)} Team</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: params.participantEmail,
      subject: `${symposiumName}: Registration Confirmed for ${safeEventName}`,
      text: textBody,
      html: htmlBody,
    });
  }

  private escapeHtml(value: string) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }

    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') || 587);
    const secure = `${this.config.get<string>('SMTP_SECURE')}`.toLowerCase() === 'true';
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      if (!this.disabledLogged) {
        this.disabledLogged = true;
        this.logger.warn('SMTP is not configured. Approval emails are disabled.');
      }
      return null;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    return this.transporter;
  }
}