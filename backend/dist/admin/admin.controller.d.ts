import { AdminService } from './admin.service';
declare class AdminCreateDto {
    email: string;
    password: string;
    name: string;
}
declare class AdminLoginDto {
    email: string;
    password: string;
}
export declare class AdminController {
    private readonly svc;
    constructor(svc: AdminService);
    create(dto: AdminCreateDto): Promise<{
        name: string;
        email: string;
        id: number;
        createdAt: Date;
        role: import(".prisma/client").$Enums.AdminRole;
    }>;
    login(dto: AdminLoginDto): Promise<{
        id: number;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.AdminRole;
    }>;
    dashboard(): Promise<{
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
    export(event?: string): Promise<({
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
export {};
