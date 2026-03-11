import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'Hackathon' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'hackathon' })
  @IsString() @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: EventCategory })
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiPropertyOptional({ example: 4 })
  @IsInt() @IsOptional()
  maxTeamSize?: number;

  @ApiPropertyOptional({ example: '₹30,000' })
  @IsString() @IsOptional()
  prizeAmount?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  venue?: string;

  @ApiPropertyOptional()
  @IsDateString() @IsOptional()
  startTime?: string;

  @ApiPropertyOptional()
  @IsDateString() @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean() @IsOptional()
  isActive?: boolean;
}
