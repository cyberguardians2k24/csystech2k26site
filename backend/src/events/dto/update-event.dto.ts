import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory } from '@prisma/client';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Hackathon' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'hackathon' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: EventCategory })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiPropertyOptional({ example: 4 })
  @IsInt()
  @IsOptional()
  maxTeamSize?: number;

  @ApiPropertyOptional({ example: '₹30,000' })
  @IsString()
  @IsOptional()
  prizeAmount?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
