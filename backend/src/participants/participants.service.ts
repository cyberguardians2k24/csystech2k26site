import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateParticipantDto) {
    const existing = await this.prisma.participant.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    return this.prisma.participant.create({ data: dto });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.participant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { registrations: { include: { event: true } } },
      }),
      this.prisma.participant.count(),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const p = await this.prisma.participant.findUnique({
      where: { id },
      include: { registrations: { include: { event: true } } },
    });
    if (!p) throw new NotFoundException('Participant not found');
    return p;
  }

  async findByEmail(email: string) {
    const p = await this.prisma.participant.findUnique({
      where: { email },
      include: { registrations: { include: { event: true } } },
    });
    if (!p) throw new NotFoundException('Participant not found');
    return p;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.participant.delete({ where: { id } });
  }
}
