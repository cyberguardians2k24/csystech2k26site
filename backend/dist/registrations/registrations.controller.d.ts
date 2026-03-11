import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
export declare class RegistrationsController {
    private readonly svc;
    constructor(svc: RegistrationsService);
    create(dto: CreateRegistrationDto): Promise<{
        success: boolean;
        message: string;
        registration: {
            event: {
                name: string;
                description: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                category: import(".prisma/client").$Enums.EventCategory;
                maxTeamSize: number;
                prizeAmount: string | null;
                venue: string | null;
                startTime: Date | null;
                endTime: Date | null;
                isActive: boolean;
            };
            participant: {
                name: string;
                email: string;
                phone: string;
                college: string;
                teamName: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
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
        };
    }>;
    findAll(page?: string, limit?: string): Promise<{
        data: ({
            event: {
                name: string;
                description: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                category: import(".prisma/client").$Enums.EventCategory;
                maxTeamSize: number;
                prizeAmount: string | null;
                venue: string | null;
                startTime: Date | null;
                endTime: Date | null;
                isActive: boolean;
            };
            participant: {
                name: string;
                email: string;
                phone: string;
                college: string;
                teamName: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
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
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getStats(): Promise<{
        totalParticipants: number;
        totalRegistrations: number;
        byEvent: {
            event: string | number;
            count: number;
        }[];
        byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.RegistrationGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
    }>;
    findOne(id: number): Promise<{
        event: {
            name: string;
            description: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: import(".prisma/client").$Enums.EventCategory;
            maxTeamSize: number;
            prizeAmount: string | null;
            venue: string | null;
            startTime: Date | null;
            endTime: Date | null;
            isActive: boolean;
        };
        participant: {
            name: string;
            email: string;
            phone: string;
            college: string;
            teamName: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    updateStatus(id: number, status: string): Promise<{
        event: {
            name: string;
            description: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: import(".prisma/client").$Enums.EventCategory;
            maxTeamSize: number;
            prizeAmount: string | null;
            venue: string | null;
            startTime: Date | null;
            endTime: Date | null;
            isActive: boolean;
        };
        participant: {
            name: string;
            email: string;
            phone: string;
            college: string;
            teamName: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    updatePaymentStatus(id: number, paymentStatus: string): Promise<{
        event: {
            name: string;
            description: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: import(".prisma/client").$Enums.EventCategory;
            maxTeamSize: number;
            prizeAmount: string | null;
            venue: string | null;
            startTime: Date | null;
            endTime: Date | null;
            isActive: boolean;
        };
        participant: {
            name: string;
            email: string;
            phone: string;
            college: string;
            teamName: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
