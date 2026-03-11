import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    const existing = await this.prisma.event.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Event slug already exists');
    return this.prisma.event.create({ data: dto as any });
  }

  async findAll(includeInactive = false) {
    return this.prisma.event.findMany({
      where:   includeInactive ? undefined : { isActive: true },
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { registrations: true } } },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where:   { id },
      include: { registrations: { include: { participant: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({ where: { slug } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.event.findUnique({ where: { slug: dto.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Event slug already exists');
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: dto as any,
      include: { _count: { select: { registrations: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.event.delete({ where: { id } });
  }

  async seed() {
    const events = [
      { name: 'Paper Presentation', slug: 'paper-presentation', description: 'Present your research on cutting-edge topics.', category: 'TECHNICAL', maxTeamSize: 2, prizeAmount: '₹15,000' },
      { name: 'Hackathon',          slug: 'hackathon',          description: '24-hour coding sprint.', category: 'CODING', maxTeamSize: 4, prizeAmount: '₹30,000' },
      { name: 'Technical Quiz',     slug: 'technical-quiz',     description: 'Test your tech knowledge.', category: 'KNOWLEDGE', maxTeamSize: 2, prizeAmount: '₹10,000' },
      { name: 'Workshop – AI/ML',   slug: 'workshop-aiml',      description: 'Hands-on AI/ML session.', category: 'SKILL', maxTeamSize: 1 },
      { name: 'Workshop – Cybersecurity', slug: 'workshop-cyber', description: 'Hands-on security session.', category: 'SKILL', maxTeamSize: 1 },
    ];

    for (const e of events) {
      await this.prisma.event.upsert({
        where:  { slug: e.slug },
        update: {},
        create: e as any,
      });
    }
    return { message: 'Events seeded successfully' };
  }
}
