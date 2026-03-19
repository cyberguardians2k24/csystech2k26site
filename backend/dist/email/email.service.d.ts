import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    private get smtpHost();
    private get smtpPort();
    private get smtpUser();
    private get smtpPass();
    private get smtpSecure();
    private get fromAddress();
    private get isEnabled();
    private getTransporter;
    sendRegistrationReceivedEmail(params: {
        to: string;
        participantName: string;
        eventName: string;
        registrationId: number;
        paymentRef?: string | null;
    }): Promise<boolean>;
    sendRegistrationConfirmedEmail(params: {
        to: string;
        participantName: string;
        eventName: string;
        registrationId: number;
    }): Promise<boolean>;
    sendRegistrationCancelledEmail(params: {
        to: string;
        participantName: string;
        eventName: string;
        registrationId: number;
        reason?: string;
    }): Promise<boolean>;
}
