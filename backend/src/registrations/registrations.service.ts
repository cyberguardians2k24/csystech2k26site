import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { PaymentStatus, RegistrationStatus } from '@prisma/client';
import { R2UploadService } from './r2-upload.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class RegistrationsService {
  constructor(
    private prisma: PrismaService,
    private readonly r2UploadService: R2UploadService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateRegistrationDto) {
    if (!dto.paymentScreenshot) {
      throw new BadRequestException('Payment screenshot is required');
    }

    const normalizedEmail = (dto.email || '').trim().toLowerCase();

    // 1. Upsert participant
    let participant = await this.prisma.participant.findUnique({ where: { email: normalizedEmail } });
    if (!participant) {
      participant = await this.prisma.participant.create({
        data: {
          name:     dto.name,
          email:    normalizedEmail,
          phone:    dto.phone,
          college:  dto.college,
          teamName: dto.teamName,
        },
      });
    }

    // 2. Find event by name or slug (case-insensitive)
    const event = await this.prisma.event.findFirst({
      where: {
        OR: [
          { name: { contains: dto.event, mode: 'insensitive' } },
          { slug: { contains: dto.event, mode: 'insensitive' } },
        ],
        isActive: true,
      },
    });
    if (!event) throw new NotFoundException(`Event "${dto.event}" not found or inactive`);

    // 3. Check for duplicate
    const existing = await this.prisma.registration.findFirst({
      where: { participantId: participant.id, eventId: event.id },
    });
    if (existing) throw new ConflictException('Already registered for this event');

    const normalizedScreenshot = this.normalizeUploadedPaymentUrl(dto.paymentScreenshot);

    // 4. Create registration
    const registration = await this.prisma.registration.create({
      data: {
        participantId: participant.id,
        eventId:       event.id,
        notes:         dto.notes,
        paymentRef:    dto.paymentRef,
        paymentScreenshot: normalizedScreenshot,
        amount:        event.registrationFeeInr ?? 0,
        paymentStatus: 'PENDING',
        status:        'PENDING',
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

  async createPaymentUploadUrl(params: {
    fileName: string;
    contentType: string;
    participantEmail: string;
    event: string;
  }) {
    if (!params.fileName || !params.contentType || !params.participantEmail || !params.event) {
      throw new BadRequestException('fileName, contentType, participantEmail, and event are required');
    }

    return this.r2UploadService.createSignedPaymentUploadUrl({
      fileName: params.fileName,
      contentType: params.contentType,
      participantEmail: params.participantEmail,
      eventSlugOrName: params.event,
    });
  }

  private normalizeUploadedPaymentUrl(value: string) {
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('r2://')) {
      return value;
    }

    throw new BadRequestException('Invalid payment screenshot URL. Upload via signed URL from frontend first.');
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

  async findOne(id: number) {
    const reg = await this.prisma.registration.findUnique({
      where: { id },
      include: { participant: true, event: true },
    });
    if (!reg) throw new NotFoundException('Registration not found');
    return reg;
  }

  async updateStatus(id: number, status: string) {
    await this.findOne(id);
    const nextStatus = status as RegistrationStatus;

    const updatedRegistration = await this.prisma.registration.update({
      where: { id },
      data:  { status: nextStatus as any },
      include: { participant: true, event: true },
    });

    const cancelledEmailSent = nextStatus === RegistrationStatus.CANCELLED
      ? await this.emailService.sendRegistrationCancelledEmail({
        to: updatedRegistration.participant.email,
        participantName: updatedRegistration.participant.name,
        eventName: updatedRegistration.event.name,
        registrationId: updatedRegistration.id,
        reason: 'Fake/invalid payment proof or admin cancellation.',
      })
      : false;

    return { ...updatedRegistration, cancelledEmailSent } as any;
  }

  async updatePaymentStatus(id: number, paymentStatus: string) {
    const registration = await this.findOne(id);

    const nextPaymentStatus = paymentStatus as PaymentStatus;
    const nextRegistrationStatus = nextPaymentStatus === 'PAID'
      ? RegistrationStatus.CONFIRMED
      : registration.status === RegistrationStatus.CONFIRMED
        ? RegistrationStatus.PENDING
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

    const confirmedEmailSent = nextPaymentStatus === PaymentStatus.PAID
      ? await this.emailService.sendRegistrationConfirmedEmail({
        to: updatedRegistration.participant.email,
        participantName: updatedRegistration.participant.name,
        eventName: updatedRegistration.event.name,
        registrationId: updatedRegistration.id,
      })
      : false;

    return { ...updatedRegistration, confirmedEmailSent } as any;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.registration.delete({ where: { id } });
  }

  async getStats() {
    const [
      confirmedParticipants,
      totalParticipants,
      totalEvents,
      activeEvents,
      totalRegistrations,
      byEvent,
      byStatus,
    ] = await Promise.all([
      this.prisma.registration.groupBy({
        by: ['participantId'],
        where: { status: RegistrationStatus.CONFIRMED },
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
}
