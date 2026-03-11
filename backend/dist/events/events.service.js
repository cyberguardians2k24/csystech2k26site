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
            { name: 'Paper Presentation', slug: 'paper-presentation', description: 'Present your research on cutting-edge topics.', category: 'TECHNICAL', maxTeamSize: 2, prizeAmount: '₹15,000' },
            { name: 'Hackathon', slug: 'hackathon', description: '24-hour coding sprint.', category: 'CODING', maxTeamSize: 4, prizeAmount: '₹30,000' },
            { name: 'Technical Quiz', slug: 'technical-quiz', description: 'Test your tech knowledge.', category: 'KNOWLEDGE', maxTeamSize: 2, prizeAmount: '₹10,000' },
            { name: 'Workshop – AI/ML', slug: 'workshop-aiml', description: 'Hands-on AI/ML session.', category: 'SKILL', maxTeamSize: 1 },
            { name: 'Workshop – Cybersecurity', slug: 'workshop-cyber', description: 'Hands-on security session.', category: 'SKILL', maxTeamSize: 1 },
        ];
        for (const e of events) {
            await this.prisma.event.upsert({
                where: { slug: e.slug },
                update: {},
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