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
      {
        name: 'Poster Presentation',
        slug: 'poster-presentation',
        description: 'Present a cyber-tech concept in poster format.',
        category: 'TECHNICAL',
        maxTeamSize: 3,
        prizeAmount: 'TBA',
      },
      {
        name: 'Neuro Byte',
        slug: 'neuro-byte',
        description: 'Cyber-tech quiz rounds with online and offline stages.',
        category: 'KNOWLEDGE',
        maxTeamSize: 1,
        prizeAmount: 'TBA',
      },
      {
        name: 'Payload Paradise',
        slug: 'payload-paradise',
        description: 'Web vulnerability assessment in a controlled lab setup.',
        category: 'CODING',
        maxTeamSize: 4,
        prizeAmount: 'TBA',
      },
      {
        name: 'Design Duel',
        slug: 'design-duel',
        description: 'Three-round fun coding and problem solving challenge.',
        category: 'CODING',
        maxTeamSize: 2,
        prizeAmount: 'TBA',
      },
      {
        name: 'Arena (Free Fire)',
        slug: 'arena-free-fire',
        description: 'Custom-room Free Fire squad tournament.',
        category: 'SKILL',
        maxTeamSize: 4,
        prizeAmount: 'TBA',
      },
      {
        name: 'Arena (BGMI)',
        slug: 'arena-bgmi',
        description: 'Best-of-3 BGMI squad competition.',
        category: 'SKILL',
        maxTeamSize: 4,
        prizeAmount: 'TBA',
      },
      {
        name: 'Kabbadi',
        slug: 'kabbadi',
        description: 'On-ground kabaddi competition.',
        category: 'SKILL',
        maxTeamSize: 7,
        prizeAmount: 'TBA',
      },
      {
        name: 'Link Logic',
        slug: 'link-logic',
        description: 'Team buzzer event across multiple rounds.',
        category: 'KNOWLEDGE',
        maxTeamSize: 4,
        prizeAmount: 'TBA',
      },
      {
        name: 'Short Film',
        slug: 'short-film',
        description: 'Original short film screening competition.',
        category: 'SKILL',
        maxTeamSize: 5,
        prizeAmount: 'TBA',
      },
    ];

    const validSlugs = events.map((event) => event.slug);

    await this.prisma.event.updateMany({
      where: { slug: { notIn: validSlugs } },
      data: { isActive: false },
    });

    for (const e of events) {
      await this.prisma.event.upsert({
        where:  { slug: e.slug },
        update: {
          name: e.name,
          description: e.description,
          category: e.category as any,
          maxTeamSize: e.maxTeamSize,
          prizeAmount: e.prizeAmount,
          isActive: true,
        },
        create: e as any,
      });
    }
    return { message: 'Events seeded successfully' };
  }
}
