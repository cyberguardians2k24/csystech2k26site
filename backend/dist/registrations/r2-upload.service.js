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
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let R2UploadService = class R2UploadService {
    constructor(config) {
        this.config = config;
        const accountId = this.config.get('R2_ACCOUNT_ID');
        const accessKeyId = this.config.get('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.config.get('R2_SECRET_ACCESS_KEY');
        const bucket = this.config.get('R2_BUCKET_NAME');
        const publicBaseUrl = this.config.get('R2_PUBLIC_BASE_URL');
        if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
            throw new Error('Missing Cloudflare R2 configuration. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME.');
        }
        this.accountId = accountId;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
        this.client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            forcePathStyle: true,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    async uploadPaymentProof(dataUrl, participantEmail, eventSlugOrName) {
        const parsed = this.parseImageDataUrl(dataUrl);
        const safeEmail = this.sanitize(participantEmail);
        const safeEvent = this.sanitize(eventSlugOrName);
        const now = Date.now();
        const key = `payment-proofs/${safeEvent}/${safeEmail}-${now}.${parsed.extension}`;
        try {
            await this.client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: parsed.buffer,
                ContentType: parsed.mime,
                ContentLength: parsed.buffer.length,
                CacheControl: 'private, max-age=0, no-store',
            }));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to upload payment proof to R2');
        }
        return {
            key,
            url: this.buildPublicUrl(key),
        };
    }
    async createSignedPaymentUploadUrl(params) {
        const extension = this.fileNameToExtension(params.fileName) || this.mimeToExtension(params.contentType?.toLowerCase());
        if (!extension) {
            throw new common_1.BadRequestException('Unsupported payment screenshot type. Use png, jpeg, jpg, webp, or gif.');
        }
        const safeEmail = this.sanitize(params.participantEmail);
        const safeEvent = this.sanitize(params.eventSlugOrName);
        const key = `payment-proofs/${safeEvent}/${safeEmail}-${Date.now()}.${extension}`;
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                ContentType: params.contentType,
                CacheControl: 'private, max-age=0, no-store',
            });
            const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: 300 });
            return {
                key,
                uploadUrl,
                storageUrl: this.buildPublicUrl(key),
            };
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to create R2 upload URL');
        }
    }
    parseImageDataUrl(dataUrl) {
        const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
        if (!match) {
            throw new common_1.BadRequestException('Invalid payment screenshot format. Send a valid image data URL.');
        }
        const mime = match[1].toLowerCase();
        const base64 = match[2];
        const extension = this.mimeToExtension(mime);
        if (!extension) {
            throw new common_1.BadRequestException('Unsupported payment screenshot type. Use png, jpeg, jpg, webp, or gif.');
        }
        const buffer = Buffer.from(base64, 'base64');
        if (!buffer.length) {
            throw new common_1.BadRequestException('Payment screenshot payload is empty.');
        }
        return { mime, extension, buffer };
    }
    mimeToExtension(mime) {
        switch (mime) {
            case 'image/jpeg':
                return 'jpg';
            case 'image/jpg':
                return 'jpg';
            case 'image/png':
                return 'png';
            case 'image/webp':
                return 'webp';
            case 'image/gif':
                return 'gif';
            default:
                return undefined;
        }
    }
    fileNameToExtension(fileName) {
        if (!fileName || !fileName.includes('.'))
            return undefined;
        const ext = fileName.split('.').pop()?.toLowerCase();
        const allowed = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
        if (!ext || !allowed.has(ext))
            return undefined;
        return ext === 'jpeg' ? 'jpg' : ext;
    }
    sanitize(value) {
        return String(value || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'unknown';
    }
    buildPublicUrl(key) {
        if (this.publicBaseUrl) {
            return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
        }
        return `r2://${this.bucket}/${key}`;
    }
};
exports.R2UploadService = R2UploadService;
exports.R2UploadService = R2UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], R2UploadService);
//# sourceMappingURL=r2-upload.service.js.map