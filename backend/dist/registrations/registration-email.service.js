"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RegistrationEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = require("nodemailer");
let RegistrationEmailService = RegistrationEmailService_1 = class RegistrationEmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(RegistrationEmailService_1.name);
        this.transporter = null;
        this.disabledLogged = false;
    }
    async sendApprovalEmail(params) {
        const transporter = this.getTransporter();
        if (!transporter) {
            return;
        }
        const from = this.config.get('SMTP_FROM') || this.config.get('SMTP_USER');
        const symposiumName = this.config.get('SYMPOSIUM_NAME') || 'CYSTECH 2K26';
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
    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    getTransporter() {
        if (this.transporter) {
            return this.transporter;
        }
        const host = this.config.get('SMTP_HOST');
        const port = Number(this.config.get('SMTP_PORT') || 587);
        const secure = `${this.config.get('SMTP_SECURE')}`.toLowerCase() === 'true';
        const user = this.config.get('SMTP_USER');
        const pass = this.config.get('SMTP_PASS');
        if (!host || !user || !pass) {
            if (!this.disabledLogged) {
                this.disabledLogged = true;
                this.logger.warn('SMTP is not configured. Approval emails are disabled.');
            }
            return null;
        }
        this.transporter = nodemailer_1.default.createTransport({
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
};
exports.RegistrationEmailService = RegistrationEmailService;
exports.RegistrationEmailService = RegistrationEmailService = RegistrationEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RegistrationEmailService);
//# sourceMappingURL=registration-email.service.js.map