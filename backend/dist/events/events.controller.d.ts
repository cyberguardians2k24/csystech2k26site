import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly svc;
    constructor(svc: EventsService);
    create(dto: CreateEventDto): Promise<{
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
    }>;
    findAll(includeInactive?: string): Promise<({
        _count: {
            registrations: number;
        };
    } & {
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
    })[]>;
    seed(): Promise<{
        message: string;
    }>;
    findOne(id: number): Promise<{
        registrations: ({
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
    } & {
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
    }>;
    findBySlug(slug: string): Promise<{
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
    }>;
    update(id: number, dto: UpdateEventDto): Promise<{
        _count: {
            registrations: number;
        };
    } & {
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
