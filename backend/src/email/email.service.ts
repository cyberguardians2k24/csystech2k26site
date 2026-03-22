  async sendBatchRegistrationConfirmedEmail(params: {
    to: string;
    participantName: string;
    events: { name: string; registrationId: number }[];
  }): Promise<boolean> {
    this.logConfigOnce();

    if (!this.isEnabled) {
      const cfg = this.safeConfigForLogs;
      this.logger.warn(`Email not enabled; skipping batch confirmation email (provider=${cfg.provider}).`);
      return false;
    }

    const subject = `CYSTECH2K26 — Registrations confirmed (${params.events.length} events)`;
    const safeName = params.participantName || 'Participant';
    const eventList = params.events.map(ev => `<li><b>${escapeHtml(ev.name)}</b> (ID: ${ev.registrationId})</li>`).join('');

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 10px;">Registrations confirmed</h2>
        <p>Hi ${escapeHtml(safeName)},</p>
        <p>Your payment has been verified and your registrations are <b>confirmed</b> for the following events:</p>
        <ul>${eventList}</ul>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p><b>Reminder:</b> Bring your college ID card and keep your payment proof available.</p>
      </div>
    `;

    try {
      if (this.hasResendEnabled) {
        await this.sendWithResend({
          to: params.to,
          subject,
          html,
        });
      } else {
        const transporter = await this.ensureTransporterReady();
        await transporter.sendMail({
          from: this.fromAddress,
          to: params.to,
          subject,
          html,
        });
      }
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send batch confirmation email to ${params.to}: ${err?.message || err}`);
      return false;
    }
  }
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private transporterVerified = false;
  private loggedConfigOnce = false;

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
    // App passwords are often copied with spaces (e.g. Gmail). Strip whitespace safely.
    return (this.config.get<string>('SMTP_PASS') || '').replace(/\s+/g, '').trim();
  }

  private get smtpSecure() {
    const raw = (this.config.get<string>('SMTP_SECURE') || '').trim().toLowerCase();
    if (raw === 'true' || raw === '1' || raw === 'yes') return true;
    if (raw === 'false' || raw === '0' || raw === 'no') return false;
    return this.smtpPort === 465;
  }

  private get fromAddress() {
    return (this.config.get<string>('SMTP_FROM') || '').trim() || this.smtpUser;
  }

  private get resendApiKey() {
    return (this.config.get<string>('RESEND_API_KEY') || '').trim();
  }

  private get resendFrom() {
    return (this.config.get<string>('RESEND_FROM') || '').trim();
  }

  private get hasResendEnabled() {
    return Boolean(this.resendApiKey);
  }

  private get isEnabled() {
    return this.hasResendEnabled || Boolean(this.smtpHost && this.fromAddress);
  }

  private get safeConfigForLogs() {
    return {
      enabled: this.isEnabled,
      provider: this.hasResendEnabled ? 'resend' : 'smtp',
      resendEnabled: this.hasResendEnabled,
      resendFrom: this.resendFrom || '(missing RESEND_FROM)',
      host: this.smtpHost || '(missing SMTP_HOST)',
      port: this.smtpPort,
      secure: this.smtpSecure,
      from: this.fromAddress || '(missing SMTP_FROM/SMTP_USER)',
      authUserSet: Boolean(this.smtpUser),
      authPassSet: Boolean(this.smtpPass),
    };
  }

  private logConfigOnce() {
    if (this.loggedConfigOnce) return;
    this.loggedConfigOnce = true;
    const cfg = this.safeConfigForLogs;
    this.logger.log(
      `Email config: enabled=${cfg.enabled} provider=${cfg.provider} resendEnabled=${cfg.resendEnabled} resendFrom=${cfg.resendFrom} host=${cfg.host} port=${cfg.port} secure=${cfg.secure} from=${cfg.from} authUserSet=${cfg.authUserSet} authPassSet=${cfg.authPassSet}`,
    );
  }

  private async sendWithResend(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    const apiKey = this.resendApiKey;
    const from = this.resendFrom || this.fromAddress;

    if (!apiKey) {
      throw new Error('Resend is not configured. Set RESEND_API_KEY.');
    }
    if (!from) {
      throw new Error('Resend sender is missing. Set RESEND_FROM (recommended).');
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        ...(params.text ? { text: params.text } : null),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Resend API error ${res.status}: ${body || res.statusText}`);
    }

    return res.json().catch(() => null);
  }

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;

    this.logConfigOnce();

    if (!this.isEnabled) {
      throw new Error('Email is not configured. Set SMTP_HOST and SMTP_FROM (or SMTP_USER). For authenticated SMTP also set SMTP_USER and SMTP_PASS.');
    }

    // If Resend is enabled, we don't need an SMTP transporter.
    if (this.hasResendEnabled) {
      throw new Error('SMTP transporter requested but Resend is enabled.');
    }

    const hasAnyAuthValue = Boolean(this.smtpUser || this.smtpPass);
    const auth = hasAnyAuthValue ? { user: this.smtpUser, pass: this.smtpPass } : undefined;

    if (hasAnyAuthValue && (!this.smtpUser || !this.smtpPass)) {
      this.logger.warn('SMTP auth appears incomplete. Ensure both SMTP_USER and SMTP_PASS are set.');
    }

    this.transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      auth,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    this.transporterVerified = false;

    return this.transporter;
  }

  private async ensureTransporterReady() {
    if (this.hasResendEnabled) {
      throw new Error('SMTP verify called but Resend is enabled.');
    }

    const transporter = this.getTransporter();
    if (this.transporterVerified) return transporter;

    try {
      await transporter.verify();
      this.transporterVerified = true;
      this.logger.log(`SMTP verified on ${this.smtpHost}:${this.smtpPort} (secure=${this.smtpSecure})`);
      return transporter;
    } catch (err: any) {
      const cfg = this.safeConfigForLogs;
      this.logger.error(
        `SMTP verify failed: host=${cfg.host} port=${cfg.port} secure=${cfg.secure} from=${cfg.from} authUserSet=${cfg.authUserSet} authPassSet=${cfg.authPassSet} :: ${err?.message || err}`,
      );
      throw err;
    }
  }

  async sendRegistrationReceivedEmail(params: {
    to: string;
    participantName: string;
    eventName: string;
    registrationId: number;
    paymentRef?: string | null;
  }): Promise<boolean> {
    this.logConfigOnce();

    if (!this.isEnabled) {
      const cfg = this.safeConfigForLogs;
      this.logger.warn(`Email not enabled; skipping registration email (provider=${cfg.provider}).`);
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
      if (this.hasResendEnabled) {
        await this.sendWithResend({
          to: params.to,
          subject,
          html,
        });
      } else {
        const transporter = await this.ensureTransporterReady();
        await transporter.sendMail({
          from: this.fromAddress,
          to: params.to,
          subject,
          html,
        });
      }
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
    this.logConfigOnce();

    if (!this.isEnabled) {
      const cfg = this.safeConfigForLogs;
      this.logger.warn(`Email not enabled; skipping confirmation email (provider=${cfg.provider}).`);
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
      if (this.hasResendEnabled) {
        await this.sendWithResend({
          to: params.to,
          subject,
          html,
        });
      } else {
        const transporter = await this.ensureTransporterReady();
        await transporter.sendMail({
          from: this.fromAddress,
          to: params.to,
          subject,
          html,
        });
      }
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
    this.logConfigOnce();

    if (!this.isEnabled) {
      const cfg = this.safeConfigForLogs;
      this.logger.warn(`Email not enabled; skipping cancellation email (provider=${cfg.provider}).`);
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
      if (this.hasResendEnabled) {
        await this.sendWithResend({
          to: params.to,
          subject,
          html,
        });
      } else {
        const transporter = await this.ensureTransporterReady();
        await transporter.sendMail({
          from: this.fromAddress,
          to: params.to,
          subject,
          html,
        });
      }
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
