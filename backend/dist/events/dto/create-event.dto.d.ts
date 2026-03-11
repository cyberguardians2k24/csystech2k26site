import { EventCategory } from '@prisma/client';
export declare class CreateEventDto {
    name: string;
    slug: string;
    description: string;
    category: EventCategory;
    maxTeamSize?: number;
    prizeAmount?: string;
    venue?: string;
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
}
