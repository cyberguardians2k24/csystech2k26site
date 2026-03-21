import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegistrationStatus } from '@prisma/client';

function normalizePaymentRef(value?: string | null) {
  return String(value ?? '').replace(/\s+/g, '').trim().toLowerCase();
}

const BASIC_PASS_INR = 149;
const SEPARATE_EVENT_PRICES_INR: Record<string, number> = {
  kabaddi: 599,
  'arena-bgmi': 300,
  'arena-free-fire': 300,
  'short-film': 300,
};

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string, name: string) {
    const existing = await this.prisma.admin.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Admin email already exists');

    const hash = await bcrypt.hash(password, 12);
    return this.prisma.admin.create({
      data: { email, password: hash, name },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return {
      id:    admin.id,
      email: admin.email,
      name:  admin.name,
      role:  admin.role,
    };
  }

  async getDashboard() {
    const [
      approvedParticipants,
      totalParticipants,
      totalRegistrations,
      totalEvents,
      recentRegistrations,
      registrationsByEvent,
      paidRegistrations,
    ] = await Promise.all([
      this.prisma.registration.groupBy({
        by: ['participantId'],
        where: { status: RegistrationStatus.CONFIRMED },
      }),
      this.prisma.participant.count(),
      this.prisma.registration.count(),
      this.prisma.event.count(),
      this.prisma.registration.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { participant: { select: { name: true, email: true, college: true } }, event: { select: { name: true } } },
      }),
      this.prisma.registration.groupBy({
        by: ['eventId'],
        _count: { id: true },
      }),
      this.prisma.registration.findMany({
        where: { paymentStatus: 'PAID' },
        select: {
          id: true,
          participantId: true,
          paymentRef: true,
          amount: true,
          event: { select: { slug: true, registrationFeeInr: true } },
        },
      }),
    ]);

    // Revenue should represent actual payments received.
    // Business rules:
    // - Basic pass: ₹149 per participant per UTR/paymentRef (covers up to 3 events)
    // - Separate checkout events: add their specific fees (Kabaddi ₹599, BGMI/FreeFire/ShortFilm ₹300)
    // Group by participantId + paymentRef to avoid counting the bundled events multiple times.
    const groups = new Map<string, typeof paidRegistrations>();
    for (const r of paidRegistrations) {
      const normalizedRef = normalizePaymentRef(r.paymentRef);
      const paymentKey = normalizedRef
        ? `${r.participantId}:${normalizedRef}`
        : `registration:${r.id}`;
      const arr = groups.get(paymentKey);
      if (arr) arr.push(r);
      else groups.set(paymentKey, [r]);
    }

    const totalRevenueInr = Array.from(groups.values()).reduce((sum, regs) => {
      const slugs = regs.map((r) => r.event?.slug).filter(Boolean) as string[];
      const uniqueSlugs = new Set(slugs);

      let groupTotal = 0;

      // Add separate event fees per event in this payment.
      for (const slug of uniqueSlugs) {
        const separateFee = SEPARATE_EVENT_PRICES_INR[slug];
        if (separateFee) groupTotal += separateFee;
      }

      // If there are any non-separate events in this payment, count one basic pass.
      const hasNonSeparate = Array.from(uniqueSlugs).some((slug) => !SEPARATE_EVENT_PRICES_INR[slug]);
      if (hasNonSeparate) groupTotal += BASIC_PASS_INR;

      // Fallback: if we still got 0 (unknown slugs), use stored amount/fee once.
      if (groupTotal === 0) {
        const first = regs[0];
        const amount = (first?.amount ?? 0) > 0 ? (first?.amount ?? 0) : (first?.event?.registrationFeeInr ?? 0);
        groupTotal = Number(amount) || 0;
      }

      return sum + groupTotal;
    }, 0);

    const events = await this.prisma.event.findMany({ select: { id: true, name: true, category: true } });
    const eventMap = Object.fromEntries(events.map(e => [e.id, e]));

    return {
      stats: {
        totalParticipants,
        confirmedParticipants: approvedParticipants.length,
        totalRegistrations,
        totalEvents,
        totalRevenueInr,
      },
      recentRegistrations: recentRegistrations.map(r => ({
        id:          r.id,
        participant: r.participant,
        event:       r.event?.name,
        status:      r.status,
        paymentStatus: r.paymentStatus,
        paymentScreenshot: r.paymentScreenshot,
        createdAt:   r.createdAt,
      })),
      registrationsByEvent: registrationsByEvent.map(r => ({
        event: eventMap[r.eventId]?.name || 'Unknown',
        category: eventMap[r.eventId]?.category,
        count: r._count.id,
      })),
    };
  }

  async exportParticipants(eventQuery?: string) {
    const where = {
      registrations: {
        some: {
          status: RegistrationStatus.CONFIRMED,
          ...(eventQuery
            ? {
                event: {
                  is: {
                    OR: [
                      { slug: eventQuery },
                      { name: { contains: eventQuery } },
                    ],
                  },
                },
              }
            : {}),
        },
      },
    };

    return this.prisma.participant.findMany({
      where,
      include: {
        registrations: {
          where: { status: RegistrationStatus.CONFIRMED },
          include: { event: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
