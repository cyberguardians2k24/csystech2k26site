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
var RegistrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const r2_upload_service_1 = require("./r2-upload.service");
const registration_email_service_1 = require("./registration-email.service");
let RegistrationsService = RegistrationsService_1 = class RegistrationsService {
    constructor(prisma, r2UploadService, registrationEmailService) {
        this.prisma = prisma;
        this.r2UploadService = r2UploadService;
        this.registrationEmailService = registrationEmailService;
        this.logger = new common_1.Logger(RegistrationsService_1.name);
    }
    async create(dto) {
        if (!dto.paymentScreenshot) {
            throw new common_1.BadRequestException('Payment screenshot is required');
        }
        let participant = await this.prisma.participant.findUnique({ where: { email: dto.email } });
        if (!participant) {
            participant = await this.prisma.participant.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    college: dto.college,
                    teamName: dto.teamName,
                },
            });
        }
        const event = await this.prisma.event.findFirst({
            where: {
                OR: [
                    { name: { contains: dto.event, mode: 'insensitive' } },
                    { slug: { contains: dto.event, mode: 'insensitive' } },
                ],
                isActive: true,
            },
        });
        if (!event)
            throw new common_1.NotFoundException(`Event "${dto.event}" not found or inactive`);
        const existing = await this.prisma.registration.findFirst({
            where: { participantId: participant.id, eventId: event.id },
        });
        if (existing)
            throw new common_1.ConflictException('Already registered for this event');
        const normalizedScreenshot = this.normalizeUploadedPaymentUrl(dto.paymentScreenshot);
        const registration = await this.prisma.registration.create({
            data: {
                participantId: participant.id,
                eventId: event.id,
                notes: dto.notes,
                paymentRef: dto.paymentRef,
                paymentScreenshot: normalizedScreenshot,
                paymentStatus: 'PENDING',
                status: 'PENDING',
            },
            include: { participant: true, event: true },
        });
        return {
            success: true,
            message: `Registration submitted for ${participant.name}. Payment verification is pending admin approval.`,
            registration,
        };
    }
    async createPaymentUploadUrl(params) {
        if (!params.fileName || !params.contentType || !params.participantEmail || !params.event) {
            throw new common_1.BadRequestException('fileName, contentType, participantEmail, and event are required');
        }
        return this.r2UploadService.createSignedPaymentUploadUrl({
            fileName: params.fileName,
            contentType: params.contentType,
            participantEmail: params.participantEmail,
            eventSlugOrName: params.event,
        });
    }
    normalizeUploadedPaymentUrl(value) {
        if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('r2://')) {
            return value;
        }
        throw new common_1.BadRequestException('Invalid payment screenshot URL. Upload via signed URL from frontend first.');
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.registration.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { participant: true, event: true },
            }),
            this.prisma.registration.count(),
        ]);
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const reg = await this.prisma.registration.findUnique({
            where: { id },
            include: { participant: true, event: true },
        });
        if (!reg)
            throw new common_1.NotFoundException('Registration not found');
        return reg;
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.registration.update({
            where: { id },
            data: { status: status },
            include: { participant: true, event: true },
        });
    }
    async updatePaymentStatus(id, paymentStatus) {
        const registration = await this.findOne(id);
        const nextPaymentStatus = paymentStatus;
        const nextRegistrationStatus = nextPaymentStatus === 'PAID'
            ? client_1.RegistrationStatus.CONFIRMED
            : registration.status === client_1.RegistrationStatus.CONFIRMED
                ? client_1.RegistrationStatus.PENDING
                : registration.status;
        const updatedRegistration = await this.prisma.registration.update({
            where: { id },
            data: {
                paymentStatus: nextPaymentStatus,
                status: nextRegistrationStatus,
            },
            include: { participant: true, event: true },
        });
        const wasConfirmed = registration.status === client_1.RegistrationStatus.CONFIRMED;
        const isNowConfirmed = updatedRegistration.status === client_1.RegistrationStatus.CONFIRMED;
        if (!wasConfirmed && isNowConfirmed) {
            try {
                await this.registrationEmailService.sendApprovalEmail({
                    participantName: updatedRegistration.participant?.name || 'Participant',
                    participantEmail: updatedRegistration.participant?.email,
                    eventName: updatedRegistration.event?.name || 'the selected event',
                });
            }
            catch (error) {
                this.logger.warn(`Failed to send approval email for registration ${id}`);
            }
        }
        return updatedRegistration;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.registration.delete({ where: { id } });
    }
    async getStats() {
        const [approvedParticipants, totalRegistrations, byEvent, byStatus] = await Promise.all([
            this.prisma.registration.groupBy({
                by: ['participantId'],
                where: { status: client_1.RegistrationStatus.CONFIRMED },
            }),
            this.prisma.registration.count(),
            this.prisma.registration.groupBy({ by: ['eventId'], _count: true }),
            this.prisma.registration.groupBy({ by: ['status'], _count: true }),
        ]);
        const events = await this.prisma.event.findMany({ select: { id: true, name: true } });
        const eventMap = Object.fromEntries(events.map(e => [e.id, e.name]));
        return {
            totalParticipants: approvedParticipants.length,
            totalRegistrations,
            byEvent: byEvent.map(r => ({ event: eventMap[r.eventId] || r.eventId, count: r._count })),
            byStatus,
        };
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = RegistrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        r2_upload_service_1.R2UploadService,
        registration_email_service_1.RegistrationEmailService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map