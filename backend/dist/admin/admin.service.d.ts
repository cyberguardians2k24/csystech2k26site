import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    create(email: string, password: string, name: string): Promise<{
        name: string;
        email: string;
        id: number;
        createdAt: Date;
        role: import(".prisma/client").$Enums.AdminRole;
    }>;
    login(email: string, password: string): Promise<{
        id: number;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.AdminRole;
    }>;
    getDashboard(): Promise<{
        stats: {
            totalParticipants: number;
            totalRegistrations: number;
            totalEvents: number;
        };
        recentRegistrations: {
            id: number;
            participant: {
                name: string;
                email: string;
                college: string;
            };
            event: string;
            status: import(".prisma/client").$Enums.RegistrationStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentScreenshot: string;
            createdAt: Date;
        }[];
        registrationsByEvent: {
            event: string;
            category: import(".prisma/client").$Enums.EventCategory;
            count: number;
        }[];
    }>;
    exportParticipants(eventQuery?: string): Promise<({
        registrations: ({
            event: {
                name: string;
                slug: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            participantId: number;
            eventId: number;
            status: import(".prisma/client").$Enums.RegistrationStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentRef: string | null;
            paymentScreenshot: string | null;
            amount: number;
            notes: string | null;
        })[];
    } & {
        name: string;
        email: string;
        phone: string;
        college: string;
        teamName: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
