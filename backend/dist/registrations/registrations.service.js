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
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const r2_upload_service_1 = require("./r2-upload.service");
const email_service_1 = require("../email/email.service");
let RegistrationsService = class RegistrationsService {
    constructor(prisma, r2UploadService, emailService) {
        this.prisma = prisma;
        this.r2UploadService = r2UploadService;
        this.emailService = emailService;
    }
    async create(dto) {
        if (!dto.paymentScreenshot) {
            throw new common_1.BadRequestException('Payment screenshot is required');
        }
        const normalizedEmail = (dto.email || '').trim().toLowerCase();
        let participant = await this.prisma.participant.findUnique({ where: { email: normalizedEmail } });
        if (!participant) {
            participant = await this.prisma.participant.create({
                data: {
                    name: dto.name,
                    email: normalizedEmail,
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
                amount: event.registrationFeeInr ?? 0,
                paymentStatus: 'PENDING',
                status: 'PENDING',
            },
            include: { participant: true, event: true },
        });
        const emailSent = await this.emailService.sendRegistrationReceivedEmail({
            to: normalizedEmail,
            participantName: registration.participant.name,
            eventName: registration.event.name,
            registrationId: registration.id,
            paymentRef: registration.paymentRef,
        });
        return {
            success: true,
            emailSent,
            message: `Registration submitted for ${participant.name}. Payment verification is pending admin approval.${emailSent ? ' A confirmation email has been sent.' : ''} If fake/edited payment proof is submitted, the registration will be cancelled.`,
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
        const nextStatus = status;
        const updatedRegistration = await this.prisma.registration.update({
            where: { id },
            data: { status: nextStatus },
            include: { participant: true, event: true },
        });
        const cancelledEmailSent = nextStatus === client_1.RegistrationStatus.CANCELLED
            ? await this.emailService.sendRegistrationCancelledEmail({
                to: updatedRegistration.participant.email,
                participantName: updatedRegistration.participant.name,
                eventName: updatedRegistration.event.name,
                registrationId: updatedRegistration.id,
                reason: 'Fake/invalid payment proof or admin cancellation.',
            })
            : false;
        return { ...updatedRegistration, cancelledEmailSent };
    }
    async updatePaymentStatus(id, paymentStatus) {
        const registration = await this.findOne(id);
        const nextPaymentStatus = paymentStatus;
        const nextRegistrationStatus = nextPaymentStatus === 'PAID'
            ? client_1.RegistrationStatus.CONFIRMED
            : registration.status === client_1.RegistrationStatus.CONFIRMED
                ? client_1.RegistrationStatus.PENDING
                : registration.status;
        const amountForPaid = (registration.amount ?? 0) > 0
            ? (registration.amount ?? 0)
            : (registration.event?.registrationFeeInr ?? 0);
        const updatedRegistration = await this.prisma.registration.update({
            where: { id },
            data: {
                paymentStatus: nextPaymentStatus,
                status: nextRegistrationStatus,
                ...(nextPaymentStatus === 'PAID' ? { amount: amountForPaid } : {}),
            },
            include: { participant: true, event: true },
        });
        const confirmedEmailSent = nextPaymentStatus === client_1.PaymentStatus.PAID
            ? await this.emailService.sendRegistrationConfirmedEmail({
                to: updatedRegistration.participant.email,
                participantName: updatedRegistration.participant.name,
                eventName: updatedRegistration.event.name,
                registrationId: updatedRegistration.id,
            })
            : false;
        return { ...updatedRegistration, confirmedEmailSent };
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.registration.delete({ where: { id } });
    }
    async getStats() {
        const [confirmedParticipants, totalParticipants, totalEvents, activeEvents, totalRegistrations, byEvent, byStatus,] = await Promise.all([
            this.prisma.registration.groupBy({
                by: ['participantId'],
                where: { status: client_1.RegistrationStatus.CONFIRMED },
            }),
            this.prisma.participant.count(),
            this.prisma.event.count(),
            this.prisma.event.count({ where: { isActive: true } }),
            this.prisma.registration.count(),
            this.prisma.registration.groupBy({ by: ['eventId'], _count: true }),
            this.prisma.registration.groupBy({ by: ['status'], _count: true }),
        ]);
        const events = await this.prisma.event.findMany({ select: { id: true, name: true } });
        const eventMap = Object.fromEntries(events.map(e => [e.id, e.name]));
        return {
            totalParticipants,
            confirmedParticipants: confirmedParticipants.length,
            totalEvents,
            activeEvents,
            totalRegistrations,
            byEvent: byEvent.map(r => ({ event: eventMap[r.eventId] || r.eventId, count: r._count })),
            byStatus,
        };
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        r2_upload_service_1.R2UploadService,
        email_service_1.EmailService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map