import { ConfigService } from '@nestjs/config';
export declare class RegistrationEmailService {
    private readonly config;
    private readonly logger;
    private transporter;
    private disabledLogged;
    constructor(config: ConfigService);
    sendApprovalEmail(params: {
        participantName: string;
        participantEmail: string;
        eventName: string;
    }): Promise<void>;
    private escapeHtml;
    private getTransporter;
}
