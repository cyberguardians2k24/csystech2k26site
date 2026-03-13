import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lookup } from 'node:dns';
import { resolve4 } from 'node:dns/promises';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Transporter } from 'nodemailer';

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
    college?: string;
    phone?: string;
    teamName?: string;
    venue?: string;
    eventDate?: string;
    paymentRef?: string;
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
    const sym = this.config.get<string>('SYMPOSIUM_NAME') || 'CYSTECH 2K26';
    const name = params.participantName || 'Participant';
    const evt  = params.eventName || 'your selected event';
    const date = params.eventDate || 'April 8, 2026';
    const venue = params.venue || 'Dhanalakshmi College of Engineering';

    const textBody = [
      `Hi ${name},`,
      '',
      `Thank you for registering for "${evt}" at ${sym}!`,
      '',
      '--- Your Registration Details ---',
      `Name    : ${name}`,
      `Email   : ${params.participantEmail}`,
      params.college  ? `College : ${params.college}`  : '',
      params.phone    ? `Phone   : ${params.phone}`    : '',
      params.teamName ? `Team    : ${params.teamName}` : '',
      '',
      '--- Event Details ---',
      `Event   : ${evt}`,
      `Date    : ${date}`,
      `Venue   : ${venue}`,
      params.paymentRef ? `Payment Ref: ${params.paymentRef}` : '',
      '',
      '--- What Happens Next ---',
      '1. Registration Received  - Your details and payment screenshot are saved.',
      '2. Payment Under Review   - Admin verifies your payment (usually within 24 hrs).',
      '3. Confirmation Email     - Once approved, you will receive a confirmation.',
      '',
      'Keep this email for your records.',
      '',
      `Regards,`,
      `${sym} Team`,
    ].filter(l => l !== undefined).join('\n');

    const row = (label: string, value: string) =>
      `<tr><td style="padding:6px 10px;color:#6b7280;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 10px;color:#111827;font-size:13px;font-weight:600">${this.escapeHtml(value)}</td></tr>`;

    const htmlBody = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:32px 16px">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#6B00BE 0%,#9D00FF 100%);padding:28px 32px">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:3px;text-transform:uppercase">${this.escapeHtml(sym)}</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:800">Registration Received &#9203;</h1>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:28px 32px">
        <p style="margin:0 0 20px;font-size:15px;color:#374151">Hi <strong>${this.escapeHtml(name)}</strong>,</p>
        <p style="margin:0 0 24px;font-size:15px;color:#374151">Thank you for registering for <strong style="color:#7c3aed">${this.escapeHtml(evt)}</strong>! Your payment screenshot has been received and is pending admin review.</p>

        <!-- Participant details -->
        <p style="margin:0 0 8px;font-size:11px;color:#9D00FF;font-weight:700;letter-spacing:2px;text-transform:uppercase">Your Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px">
          <tbody>
            ${row('Name', name)}
            ${row('Email', params.participantEmail)}
            ${params.college ? row('College', params.college) : ''}
            ${params.phone ? row('Phone', params.phone) : ''}
            ${params.teamName ? row('Team', params.teamName) : ''}
          </tbody>
        </table>

        <!-- Event details -->
        <p style="margin:0 0 8px;font-size:11px;color:#9D00FF;font-weight:700;letter-spacing:2px;text-transform:uppercase">Event Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px">
          <tbody>
            ${row('Event', evt)}
            ${row('Date', date)}
            ${row('Venue', venue)}
            ${params.paymentRef ? row('Payment Ref', params.paymentRef) : ''}
          </tbody>
        </table>

        <!-- Status banner -->
        <div style="background:#fffbeb;border:1px solid #fbbf24;border-radius:8px;padding:14px 18px;margin-bottom:24px">
          <p style="margin:0;font-size:13px;font-weight:700;color:#92400e">&#9203; Status: Pending Admin Approval</p>
          <p style="margin:6px 0 0;font-size:13px;color:#92400e">An admin will review your payment screenshot and confirm your spot — usually within 24 hours.</p>
        </div>

        <!-- Steps -->
        <p style="margin:0 0 12px;font-size:11px;color:#9D00FF;font-weight:700;letter-spacing:2px;text-transform:uppercase">What Happens Next</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
          <tr>
            <td valign="top" style="width:36px"><div style="width:28px;height:28px;border-radius:50%;background:#dcfce7;color:#166534;font-size:12px;font-weight:700;text-align:center;line-height:28px">&#10003;</div></td>
            <td style="padding:4px 0 4px 8px"><p style="margin:0;font-size:13px;font-weight:700;color:#166534">Registration Received</p><p style="margin:2px 0 0;font-size:12px;color:#6b7280">Your details and payment screenshot are saved.</p></td>
          </tr>
          <tr>
            <td valign="top" style="width:36px"><div style="width:28px;height:28px;border-radius:50%;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;text-align:center;line-height:28px">02</div></td>
            <td style="padding:4px 0 4px 8px"><p style="margin:0;font-size:13px;font-weight:700;color:#92400e">Payment Under Review</p><p style="margin:2px 0 0;font-size:12px;color:#6b7280">Admin verifies your payment proof (usually within 24 hrs).</p></td>
          </tr>
          <tr>
            <td valign="top" style="width:36px"><div style="width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#9ca3af;font-size:12px;font-weight:700;text-align:center;line-height:28px">03</div></td>
            <td style="padding:4px 0 4px 8px"><p style="margin:0;font-size:13px;font-weight:700;color:#6b7280">Confirmation Email Sent</p><p style="margin:2px 0 0;font-size:12px;color:#6b7280">Once approved, a confirmation email will be sent to you.</p></td>
          </tr>
        </table>

        <p style="margin:0;font-size:14px;color:#374151">Keep this email for your records.<br/>Regards,<br/><strong>${this.escapeHtml(sym)} Team</strong></p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
        <p style="margin:0;font-size:11px;color:#9ca3af">&copy; ${new Date().getFullYear()} ${this.escapeHtml(sym)} &middot; Dept. of Computer Science &middot; Sri Eshwar College of Engineering</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

    const info = await this.sendMailWithNetworkFallback(transporter, {
      from,
      to: params.participantEmail,
      subject: `[${sym}] Registration Received — ${evt}`,
      text: textBody,
      html: htmlBody,
    });

    this.logDelivery('registration-received', params.participantEmail, info);
  }

  async sendApprovalEmail(params: {
    participantName: string;
    participantEmail: string;
    eventName: string;
    college?: string;
    phone?: string;
    teamName?: string;
    venue?: string;
    eventDate?: string;
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
    const sym  = this.config.get<string>('SYMPOSIUM_NAME') || 'CYSTECH 2K26';
    const name = params.participantName || 'Participant';
    const evt  = params.eventName || 'your selected event';
    const date = params.eventDate || 'April 8, 2026';
    const venue = params.venue || 'Sri Eshwar College of Engineering';

    const textBody = [
      `Hi ${name},`,
      '',
      `Great news! Your registration for "${evt}" at ${sym} has been CONFIRMED!`,
      '',
      '--- Registration Details ---',
      `Name    : ${name}`,
      `Email   : ${params.participantEmail}`,
      params.college  ? `College : ${params.college}`  : '',
      params.phone    ? `Phone   : ${params.phone}`    : '',
      params.teamName ? `Team    : ${params.teamName}` : '',
      '',
      '--- Event Details ---',
      `Event   : ${evt}`,
      `Date    : ${date}`,
      `Venue   : ${venue}`,
      '',
      'Please arrive on time and carry this email as proof of registration.',
      '',
      `Regards,`,
      `${sym} Team`,
    ].filter(l => l !== undefined).join('\n');

    const row = (label: string, value: string) =>
      `<tr><td style="padding:6px 10px;color:#6b7280;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 10px;color:#111827;font-size:13px;font-weight:600">${this.escapeHtml(value)}</td></tr>`;

    const htmlBody = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:32px 16px">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#065f46 0%,#059669 100%);padding:28px 32px">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:3px;text-transform:uppercase">${this.escapeHtml(sym)}</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:800">&#10003; Registration Confirmed!</h1>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:28px 32px">
        <p style="margin:0 0 20px;font-size:15px;color:#374151">Hi <strong>${this.escapeHtml(name)}</strong>,</p>
        <p style="margin:0 0 24px;font-size:15px;color:#374151">Your registration for <strong style="color:#059669">${this.escapeHtml(evt)}</strong> has been <strong style="color:#059669">approved</strong> by the admin team. You are now a confirmed participant!</p>

        <!-- Participant details -->
        <p style="margin:0 0 8px;font-size:11px;color:#059669;font-weight:700;letter-spacing:2px;text-transform:uppercase">Your Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px">
          <tbody>
            ${row('Name', name)}
            ${row('Email', params.participantEmail)}
            ${params.college ? row('College', params.college) : ''}
            ${params.phone ? row('Phone', params.phone) : ''}
            ${params.teamName ? row('Team', params.teamName) : ''}
          </tbody>
        </table>

        <!-- Event details -->
        <p style="margin:0 0 8px;font-size:11px;color:#059669;font-weight:700;letter-spacing:2px;text-transform:uppercase">Event Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px">
          <tbody>
            ${row('Event', evt)}
            ${row('Date', date)}
            ${row('Venue', venue)}
          </tbody>
        </table>

        <!-- Confirmed banner -->
        <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:14px 18px;margin-bottom:24px">
          <p style="margin:0;font-size:13px;font-weight:700;color:#065f46">&#10003; You're In! Registration Confirmed</p>
          <p style="margin:6px 0 0;font-size:13px;color:#065f46">Please arrive on time at the venue and carry this email as proof of registration.</p>
        </div>

        <p style="margin:0;font-size:14px;color:#374151">See you at ${this.escapeHtml(sym)}!<br/>Regards,<br/><strong>${this.escapeHtml(sym)} Team</strong></p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
        <p style="margin:0;font-size:11px;color:#9ca3af">&copy; ${new Date().getFullYear()} ${this.escapeHtml(sym)} &middot; Dept. of Computer Science &middot; Sri Eshwar College of Engineering</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

    const info = await this.sendMailWithNetworkFallback(transporter, {
      from,
      to: params.participantEmail,
      subject: `[${sym}] Registration Confirmed ✓ — ${evt}`,
      text: textBody,
      html: htmlBody,
    });

    this.logDelivery('registration-approved', params.participantEmail, info);
  }

  private logDelivery(kind: 'registration-received' | 'registration-approved', to: string, info: SentMessageInfo) {
    const accepted = Array.isArray(info.accepted) ? info.accepted.join(', ') : '';
    const rejected = Array.isArray(info.rejected) ? info.rejected.join(', ') : '';
    this.logger.log(`Email sent [${kind}] to ${to}; messageId=${info.messageId}; accepted=[${accepted}] rejected=[${rejected}]`);
  }

  private async sendMailWithNetworkFallback(transporter: Transporter, mail: nodemailer.SendMailOptions) {
    try {
      return await transporter.sendMail(mail);
    } catch (error) {
      if (!this.isNetworkError(error)) {
        throw error;
      }

      const reason = error instanceof Error ? error.message : 'Unknown network error';
      this.logger.warn(`Primary SMTP delivery failed (${reason}). Retrying via IPv4 TLS fallback.`);

      try {
        const fallback = await this.createIpv4FallbackTransporter();
        return await fallback.sendMail(mail);
      } catch (fallbackError) {
        const fallbackReason = fallbackError instanceof Error ? fallbackError.message : 'Unknown fallback error';

        if (!this.hasResendConfig()) {
          throw fallbackError;
        }

        this.logger.warn(`IPv4 TLS fallback failed (${fallbackReason}). Retrying via Resend HTTPS API.`);
        return this.sendViaResend(mail);
      }
    }
  }

  private isNetworkError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error || '');
    return /ENETUNREACH|ETIMEDOUT|Connection timeout|EHOSTUNREACH|ECONNREFUSED/i.test(message);
  }

  private hasResendConfig() {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    return Boolean(apiKey && apiKey.trim());
  }

  private async sendViaResend(mail: nodemailer.SendMailOptions): Promise<SentMessageInfo> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const fromOverride = this.config.get<string>('RESEND_FROM');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const toRaw = mail.to;
    const to = typeof toRaw === 'string' ? toRaw : '';
    const subject = typeof mail.subject === 'string' ? mail.subject : 'CYSTECH Notification';
    const text = typeof mail.text === 'string' ? mail.text : undefined;
    const html = typeof mail.html === 'string' ? mail.html : undefined;
    const from = fromOverride || (typeof mail.from === 'string' ? mail.from : this.config.get<string>('SMTP_FROM') || this.config.get<string>('SMTP_USER') || '');

    if (!to) {
      throw new Error('Resend fallback requires a string "to" email address');
    }

    if (!from) {
      throw new Error('Resend fallback requires RESEND_FROM or SMTP_FROM');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => 'Unknown Resend API error');
      throw new Error(`Resend API failed (${response.status}): ${details}`);
    }

    const payload = await response.json().catch(() => ({} as any));
    const resendId = typeof payload?.id === 'string' ? payload.id : 'resend-accepted';

    this.logger.log(`Email sent via Resend fallback; id=${resendId}; to=${to}`);

    return {
      accepted: [to],
      rejected: [],
      envelopeTime: 0,
      messageTime: 0,
      messageSize: 0,
      response: `resend:${resendId}`,
      envelope: { from, to: [to] },
      messageId: resendId,
    } as SentMessageInfo;
  }

  private async createIpv4FallbackTransporter() {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      throw new Error('SMTP fallback unavailable: missing SMTP_HOST/SMTP_USER/SMTP_PASS');
    }

    const addresses = await resolve4(host);
    if (!addresses.length) {
      throw new Error(`SMTP fallback unavailable: no IPv4 address resolved for ${host}`);
    }

    return nodemailer.createTransport({
      host: addresses[0],
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
      tls: {
        // Keep certificate validation against original SMTP hostname.
        servername: host,
      },
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 30_000,
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
        this.logger.warn('SMTP is not configured. Registration and approval emails are disabled.');
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
      // Render can resolve Gmail to IPv6 addresses that are not reachable from the runtime.
      // Force IPv4 lookup to prevent ENETUNREACH and intermittent connection timeouts.
      lookup: (hostname, options, callback) => {
        lookup(hostname, { ...options, family: 4, all: false }, callback);
      },
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 30_000,
    });

    return this.transporter;
  }
}