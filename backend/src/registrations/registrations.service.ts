import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { PaymentStatus, RegistrationStatus } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    if (!dto.paymentScreenshot?.startsWith('data:image/')) {
      throw new BadRequestException('Payment screenshot is required');
    }

    // 1. Upsert participant
    let participant = await this.prisma.participant.findUnique({ where: { email: dto.email } });
    if (!participant) {
      participant = await this.prisma.participant.create({
        data: {
          name:     dto.name,
          email:    dto.email,
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

    // 4. Create registration
    const registration = await this.prisma.registration.create({
      data: {
        participantId: participant.id,
        eventId:       event.id,
        notes:         dto.notes,
        paymentRef:    dto.paymentRef,
        paymentScreenshot: dto.paymentScreenshot,
        paymentStatus: 'PENDING',
        status:        'PENDING',
      },
      include: { participant: true, event: true },
    });

    return {
      success: true,
      message: `Registration submitted for ${participant.name}. Payment verification is pending admin approval.`,
      registration,
    };
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
    return this.prisma.registration.update({
      where: { id },
      data:  { status: status as any },
      include: { participant: true, event: true },
    });
  }

  async updatePaymentStatus(id: number, paymentStatus: string) {
    const registration = await this.findOne(id);

    const nextPaymentStatus = paymentStatus as PaymentStatus;
    const nextRegistrationStatus = nextPaymentStatus === 'PAID'
      ? RegistrationStatus.CONFIRMED
      : registration.status === RegistrationStatus.CONFIRMED
        ? RegistrationStatus.PENDING
        : registration.status;

    return this.prisma.registration.update({
      where: { id },
      data: {
        paymentStatus: nextPaymentStatus,
        status: nextRegistrationStatus,
      },
      include: { participant: true, event: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.registration.delete({ where: { id } });
  }

  async getStats() {
    const [totalParticipants, totalRegistrations, byEvent, byStatus] = await Promise.all([
      this.prisma.participant.count(),
      this.prisma.registration.count(),
      this.prisma.registration.groupBy({ by: ['eventId'], _count: true }),
      this.prisma.registration.groupBy({ by: ['status'], _count: true }),
    ]);

    const events = await this.prisma.event.findMany({ select: { id: true, name: true } });
    const eventMap = Object.fromEntries(events.map(e => [e.id, e.name]));

    return {
      totalParticipants,
      totalRegistrations,
      byEvent: byEvent.map(r => ({ event: eventMap[r.eventId] || r.eventId, count: r._count })),
      byStatus,
    };
  }
}
