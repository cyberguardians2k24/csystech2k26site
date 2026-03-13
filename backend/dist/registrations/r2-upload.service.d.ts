import { ConfigService } from '@nestjs/config';
export declare class R2UploadService {
    private readonly config;
    private readonly bucket;
    private readonly publicBaseUrl?;
    private readonly accountId;
    private readonly client;
    constructor(config: ConfigService);
    uploadPaymentProof(dataUrl: string, participantEmail: string, eventSlugOrName: string): Promise<{
        key: string;
        url: string;
    }>;
    createSignedPaymentUploadUrl(params: {
        fileName: string;
        contentType: string;
        participantEmail: string;
        eventSlugOrName: string;
    }): Promise<{
        key: string;
        uploadUrl: string;
        storageUrl: string;
    }>;
    private parseImageDataUrl;
    private mimeToExtension;
    private fileNameToExtension;
    private sanitize;
    private buildPublicUrl;
}
