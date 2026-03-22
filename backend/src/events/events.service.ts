import { Injectable, NotFoundException, ConflictException, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

const BASIC_PASS_INR = 149;
const SEPARATE_EVENT_PRICES_INR: Record<string, number> = {
  kabaddi: 599,
  'arena-bgmi': 200,
  'arena-free-fire': 200,
  'short-film': 300,
};

function normalizeSlug(value?: string) {
  return String(value ?? '').trim().toLowerCase();
}

function canonicalEventSlug(value?: string) {
  const slug = normalizeSlug(value);
  if (slug === 'kabbadi') return 'kabaddi';
  return slug;
}

function withDefaultFee(dto: CreateEventDto | UpdateEventDto) {
  const slug = canonicalEventSlug((dto as any)?.slug);
  if (!slug) return dto;

  const separateFee = SEPARATE_EVENT_PRICES_INR[slug];
  if (separateFee) {
    return {
      ...dto,
      slug,
      registrationFeeInr: separateFee,
      ...(slug === 'kabaddi' ? { maxTeamSize: 15 } : null),
    } as any;
  }

  // Default fee for regular events
  if ((dto as any).registrationFeeInr === undefined) {
    return {
      ...dto,
      registrationFeeInr: BASIC_PASS_INR,
    } as any;
  }
  return dto;
}

@Injectable()
export class EventsService implements OnModuleInit {
  private readonly logger = new Logger(EventsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Ensure fixed pricing + team limits for special events even if DB was seeded earlier with defaults.
    // Also reconcile common legacy typos (e.g., "kabbadi" -> "kabaddi") to keep registration + revenue correct.
    try {
      const kabaddi = await this.prisma.event.findUnique({ where: { slug: 'kabaddi' } });
      const kabbadi = await this.prisma.event.findUnique({ where: { slug: 'kabbadi' } });

      if (!kabaddi && kabbadi) {
        await this.prisma.event.update({
          where: { id: kabbadi.id },
          data: { slug: 'kabaddi', registrationFeeInr: 599, maxTeamSize: 15 },
        });
      } else {
        await this.prisma.event.updateMany({ where: { slug: { in: ['kabaddi', 'kabbadi'] } }, data: { registrationFeeInr: 599, maxTeamSize: 15 } });
      }

      await this.prisma.event.updateMany({ where: { slug: 'arena-bgmi' }, data: { registrationFeeInr: 200 } });
      await this.prisma.event.updateMany({ where: { slug: 'arena-free-fire' }, data: { registrationFeeInr: 200 } });
      await this.prisma.event.updateMany({ where: { slug: 'short-film' }, data: { registrationFeeInr: 300 } });
    } catch (err) {
      this.logger.warn(`Could not reconcile event fees on startup: ${String((err as any)?.message ?? err)}`);
    }
  }

  async create(dto: CreateEventDto) {
    const patched = withDefaultFee(dto);
    const existing = await this.prisma.event.findUnique({ where: { slug: patched.slug } });
    if (existing) throw new ConflictException('Event slug already exists');
    return this.prisma.event.create({ data: patched as any });
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

    const patched = withDefaultFee(dto);

    if (patched.slug) {
      const existing = await this.prisma.event.findUnique({ where: { slug: patched.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Event slug already exists');
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: patched as any,
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
        name: 'Cipher Vista',
        slug: 'cipher-vista',
        description: 'Present a sharp cyber-tech idea with clarity and originality.',
        category: 'TECHNICAL',
        maxTeamSize: 3,
        registrationFeeInr: BASIC_PASS_INR,
        prizeAmount: 'TBA',
      },
      {
        name: 'Bug Bash',
        slug: 'bug-bash',
        description: 'Multi-round debugging event focused on speed and accuracy.',
        category: 'CODING',
        maxTeamSize: 2,
        registrationFeeInr: BASIC_PASS_INR,
        prizeAmount: 'TBA',
      },
      {
        name: 'Neuro Byte',
        slug: 'neuro-byte',
        description: 'Cyber-tech quiz rounds with online and offline stages.',
        category: 'KNOWLEDGE',
        maxTeamSize: 1,
        registrationFeeInr: BASIC_PASS_INR,
        prizeAmount: 'TBA',
      },
      {
        name: 'Payload Paradise',
        slug: 'payload-paradise',
        description: 'Web vulnerability assessment in a controlled lab setup.',
        category: 'CODING',
        maxTeamSize: 4,
        registrationFeeInr: BASIC_PASS_INR,
        prizeAmount: 'TBA',
      },
      {
        name: 'Design Duel',
        slug: 'design-duel',
        description: 'Three-round fun coding and problem solving challenge.',
        category: 'CODING',
        maxTeamSize: 2,
        registrationFeeInr: BASIC_PASS_INR,
        prizeAmount: 'TBA',
      },
      {
        name: 'Arena (Free Fire)',
        slug: 'arena-free-fire',
        description: 'Custom-room Free Fire squad tournament.',
        category: 'SKILL',
        maxTeamSize: 4,
        registrationFeeInr: 200,
        prizeAmount: 'TBA',
      },
      {
        name: 'Arena (BGMI)',
        slug: 'arena-bgmi',
        description: 'Best-of-3 BGMI squad competition.',
        category: 'SKILL',
        maxTeamSize: 4,
        registrationFeeInr: 200,
        prizeAmount: 'TBA',
      },
      {
        name: 'Kabaddi',
        slug: 'kabaddi',
        description: 'On-ground kabaddi competition.',
        category: 'SKILL',
        maxTeamSize: 15,
        registrationFeeInr: 599,
        prizeAmount: 'TBA',
      },
      {
        name: 'Link Logic',
        slug: 'link-logic',
        description: 'Team buzzer event across multiple rounds.',
        category: 'KNOWLEDGE',
        maxTeamSize: 4,
        registrationFeeInr: BASIC_PASS_INR,
        prizeAmount: 'TBA',
      },
      {
        name: 'Short Film',
        slug: 'short-film',
        description: 'Original short film screening competition.',
        category: 'SKILL',
        maxTeamSize: 5,
        registrationFeeInr: 300,
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
          registrationFeeInr: (e as any).registrationFeeInr,
          prizeAmount: e.prizeAmount,
          isActive: true,
        },
        create: e as any,
      });
    }
    return { message: 'Events seeded successfully' };
  }
}
