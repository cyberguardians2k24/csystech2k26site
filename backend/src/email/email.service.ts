import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  private get smtpHost() {
    return (this.config.get<string>('SMTP_HOST') || '').trim();
  }

  private get smtpPort() {
    const raw = this.config.get<string>('SMTP_PORT');
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 587;
  }

  private get smtpUser() {
    return (this.config.get<string>('SMTP_USER') || '').trim();
  }

  private get smtpPass() {
    return (this.config.get<string>('SMTP_PASS') || '').trim();
  }

  private get smtpSecure() {
    const raw = (this.config.get<string>('SMTP_SECURE') || '').trim().toLowerCase();
    if (raw === 'true' || raw === '1' || raw === 'yes') return true;
    if (raw === 'false' || raw === '0' || raw === 'no') return false;
    return this.smtpPort === 465;
  }

  private get fromAddress() {
    return (this.config.get<string>('SMTP_FROM') || '').trim();
  }

  private get isEnabled() {
    return Boolean(this.smtpHost && this.fromAddress);
  }

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;

    if (!this.isEnabled) {
      throw new Error('Email is not configured. Set SMTP_HOST and SMTP_FROM (and usually SMTP_USER/SMTP_PASS).');
    }

    const auth = this.smtpUser
      ? { user: this.smtpUser, pass: this.smtpPass }
      : undefined;

    this.transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      auth,
    });

    return this.transporter;
  }

  async sendRegistrationReceivedEmail(params: {
    to: string;
    participantName: string;
    eventName: string;
    registrationId: number;
    paymentRef?: string | null;
  }): Promise<boolean> {
    if (!this.isEnabled) {
      this.logger.warn('SMTP not configured; skipping registration email.');
      return false;
    }

    const subject = `CYSTECH2K26 — Registration received for ${params.eventName}`;

    const safeName = params.participantName || 'Participant';
    const paymentRefLine = params.paymentRef ? `<p><b>UTR / Ref:</b> ${escapeHtml(params.paymentRef)}</p>` : '';

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 10px;">Registration received</h2>
        <p>Hi ${escapeHtml(safeName)},</p>
        <p>Your registration has been received for <b>${escapeHtml(params.eventName)}</b>.</p>
        <p><b>Registration ID:</b> ${params.registrationId}</p>
        ${paymentRefLine}
        <p><b>Status:</b> Payment verification pending admin approval.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p><b>Important:</b> If any fake/edited payment proof is submitted, the registration will be cancelled.</p>
        <p>This is an automated email. Please keep your payment proof ready on event day.</p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: this.fromAddress,
        to: params.to,
        subject,
        html,
      });
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send registration email to ${params.to}: ${err?.message || err}`);
      return false;
    }
  }

  async sendRegistrationConfirmedEmail(params: {
    to: string;
    participantName: string;
    eventName: string;
    registrationId: number;
  }): Promise<boolean> {
    if (!this.isEnabled) {
      this.logger.warn('SMTP not configured; skipping confirmation email.');
      return false;
    }

    const subject = `CYSTECH2K26 — Registration confirmed for ${params.eventName}`;
    const safeName = params.participantName || 'Participant';

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 10px;">Registration confirmed</h2>
        <p>Hi ${escapeHtml(safeName)},</p>
        <p>Your payment has been verified and your registration is <b>confirmed</b> for <b>${escapeHtml(params.eventName)}</b>.</p>
        <p><b>Registration ID:</b> ${params.registrationId}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p><b>Reminder:</b> Bring your college ID card and keep your payment proof available.</p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: this.fromAddress,
        to: params.to,
        subject,
        html,
      });
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send confirmation email to ${params.to}: ${err?.message || err}`);
      return false;
    }
  }

  async sendRegistrationCancelledEmail(params: {
    to: string;
    participantName: string;
    eventName: string;
    registrationId: number;
    reason?: string;
  }): Promise<boolean> {
    if (!this.isEnabled) {
      this.logger.warn('SMTP not configured; skipping cancellation email.');
      return false;
    }

    const subject = `CYSTECH2K26 — Registration cancelled for ${params.eventName}`;
    const safeName = params.participantName || 'Participant';
    const reason = params.reason ? `<p><b>Reason:</b> ${escapeHtml(params.reason)}</p>` : '';

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 10px;">Registration cancelled</h2>
        <p>Hi ${escapeHtml(safeName)},</p>
        <p>Your registration has been <b>cancelled</b> for <b>${escapeHtml(params.eventName)}</b>.</p>
        <p><b>Registration ID:</b> ${params.registrationId}</p>
        ${reason}
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p>If you believe this is a mistake, please contact the symposium organizers.</p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: this.fromAddress,
        to: params.to,
        subject,
        html,
      });
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send cancellation email to ${params.to}: ${err?.message || err}`);
      return false;
    }
  }
}

function escapeHtml(input: string) {
  return String(input)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
