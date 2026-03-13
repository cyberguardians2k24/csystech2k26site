import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2UploadService {
  private readonly bucket: string;
  private readonly publicBaseUrl?: string;
  private readonly accountId: string;
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    const bucket = this.config.get<string>('R2_BUCKET_NAME');
    const publicBaseUrl = this.config.get<string>('R2_PUBLIC_BASE_URL');

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('Missing Cloudflare R2 configuration. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME.');
    }

    this.accountId = accountId;
    this.bucket = bucket;
    this.publicBaseUrl = publicBaseUrl;

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadPaymentProof(dataUrl: string, participantEmail: string, eventSlugOrName: string) {
    const parsed = this.parseImageDataUrl(dataUrl);
    const safeEmail = this.sanitize(participantEmail);
    const safeEvent = this.sanitize(eventSlugOrName);
    const now = Date.now();
    const key = `payment-proofs/${safeEvent}/${safeEmail}-${now}.${parsed.extension}`;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: parsed.buffer,
          ContentType: parsed.mime,
          ContentLength: parsed.buffer.length,
          CacheControl: 'private, max-age=0, no-store',
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload payment proof to R2');
    }

    return {
      key,
      url: this.buildPublicUrl(key),
    };
  }

  async createSignedPaymentUploadUrl(params: {
    fileName: string;
    contentType: string;
    participantEmail: string;
    eventSlugOrName: string;
  }) {
    const extension = this.fileNameToExtension(params.fileName) || this.mimeToExtension(params.contentType?.toLowerCase());
    if (!extension) {
      throw new BadRequestException('Unsupported payment screenshot type. Use png, jpeg, jpg, webp, or gif.');
    }

    const safeEmail = this.sanitize(params.participantEmail);
    const safeEvent = this.sanitize(params.eventSlugOrName);
    const key = `payment-proofs/${safeEvent}/${safeEmail}-${Date.now()}.${extension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: params.contentType,
        CacheControl: 'private, max-age=0, no-store',
      });

      const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 300 });

      return {
        key,
        uploadUrl,
        storageUrl: this.buildPublicUrl(key),
      };
    } catch {
      throw new InternalServerErrorException('Failed to create R2 upload URL');
    }
  }

  private parseImageDataUrl(dataUrl: string) {
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
    if (!match) {
      throw new BadRequestException('Invalid payment screenshot format. Send a valid image data URL.');
    }

    const mime = match[1].toLowerCase();
    const base64 = match[2];
    const extension = this.mimeToExtension(mime);

    if (!extension) {
      throw new BadRequestException('Unsupported payment screenshot type. Use png, jpeg, jpg, webp, or gif.');
    }

    const buffer = Buffer.from(base64, 'base64');
    if (!buffer.length) {
      throw new BadRequestException('Payment screenshot payload is empty.');
    }

    return { mime, extension, buffer };
  }

  private mimeToExtension(mime: string) {
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

  private fileNameToExtension(fileName: string) {
    if (!fileName || !fileName.includes('.')) return undefined;
    const ext = fileName.split('.').pop()?.toLowerCase();
    const allowed = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
    if (!ext || !allowed.has(ext)) return undefined;
    return ext === 'jpeg' ? 'jpg' : ext;
  }

  private sanitize(value: string) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'unknown';
  }

  private buildPublicUrl(key: string) {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
    }

    return `r2://${this.bucket}/${key}`;
  }
}