import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
export declare class ParticipantsController {
    private readonly svc;
    constructor(svc: ParticipantsService);
    create(dto: CreateParticipantDto): Promise<{
        name: string;
        email: string;
        phone: string;
        college: string;
        teamName: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: string, limit?: string): Promise<{
        data: ({
            registrations: ({
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
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<{
        registrations: ({
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
    }>;
    findByEmail(email: string): Promise<{
        registrations: ({
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
    }>;
    remove(id: number): Promise<{
        name: string;
        email: string;
        phone: string;
        college: string;
        teamName: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
