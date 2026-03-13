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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.event.findUnique({ where: { slug: dto.slug } });
        if (existing)
            throw new common_1.ConflictException('Event slug already exists');
        return this.prisma.event.create({ data: dto });
    }
    async findAll(includeInactive = false) {
        return this.prisma.event.findMany({
            where: includeInactive ? undefined : { isActive: true },
            orderBy: { createdAt: 'asc' },
            include: { _count: { select: { registrations: true } } },
        });
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { registrations: { include: { participant: true } } },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return event;
    }
    async findBySlug(slug) {
        const event = await this.prisma.event.findUnique({ where: { slug } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return event;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.slug) {
            const existing = await this.prisma.event.findUnique({ where: { slug: dto.slug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Event slug already exists');
            }
        }
        return this.prisma.event.update({
            where: { id },
            data: dto,
            include: { _count: { select: { registrations: true } } },
        });
    }
    async remove(id) {
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
                name: 'Bug Bash',
                slug: 'bug-bash',
                description: 'Multi-round debugging event focused on speed and accuracy.',
                category: 'CODING',
                maxTeamSize: 2,
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
                where: { slug: e.slug },
                update: {
                    name: e.name,
                    description: e.description,
                    category: e.category,
                    maxTeamSize: e.maxTeamSize,
                    prizeAmount: e.prizeAmount,
                    isActive: true,
                },
                create: e,
            });
        }
        return { message: 'Events seeded successfully' };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map