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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(email, password, name) {
        const existing = await this.prisma.admin.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException('Admin email already exists');
        const hash = await bcrypt.hash(password, 12);
        return this.prisma.admin.create({
            data: { email, password: hash, name },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
    }
    async login(email, password) {
        const admin = await this.prisma.admin.findUnique({ where: { email } });
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        };
    }
    async getDashboard() {
        const [approvedParticipants, totalRegistrations, totalEvents, recentRegistrations, registrationsByEvent,] = await Promise.all([
            this.prisma.registration.groupBy({
                by: ['participantId'],
                where: { status: client_1.RegistrationStatus.CONFIRMED },
            }),
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
                totalParticipants: approvedParticipants.length,
                totalRegistrations,
                totalEvents,
            },
            recentRegistrations: recentRegistrations.map(r => ({
                id: r.id,
                participant: r.participant,
                event: r.event?.name,
                status: r.status,
                paymentStatus: r.paymentStatus,
                paymentScreenshot: r.paymentScreenshot,
                createdAt: r.createdAt,
            })),
            registrationsByEvent: registrationsByEvent.map(r => ({
                event: eventMap[r.eventId]?.name || 'Unknown',
                category: eventMap[r.eventId]?.category,
                count: r._count.id,
            })),
        };
    }
    async exportParticipants(eventQuery) {
        const where = {
            registrations: {
                some: {
                    status: client_1.RegistrationStatus.CONFIRMED,
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
                    where: { status: client_1.RegistrationStatus.CONFIRMED },
                    include: { event: { select: { name: true, slug: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map