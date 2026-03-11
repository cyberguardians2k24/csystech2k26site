import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

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
      totalParticipants,
      totalRegistrations,
      totalEvents,
      recentRegistrations,
      registrationsByEvent,
    ] = await Promise.all([
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
    ]);

    const events = await this.prisma.event.findMany({ select: { id: true, name: true, category: true } });
    const eventMap = Object.fromEntries(events.map(e => [e.id, e]));

    return {
      stats: {
        totalParticipants,
        totalRegistrations,
        totalEvents,
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
    const where = eventQuery
      ? {
          registrations: {
            some: {
              event: {
                is: {
                  OR: [
                    { slug: eventQuery },
                    { name: { contains: eventQuery } },
                  ],
                },
              },
            },
          },
        }
      : {};

    return this.prisma.participant.findMany({
      where,
      include: {
        registrations: {
          include: { event: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
