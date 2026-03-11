import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({ example: 'T\'Challa Wakanda' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'tchalla@wakanda.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Wakanda Institute of Technology' })
  @IsString()
  @IsNotEmpty()
  college: string;

  @ApiPropertyOptional({ example: 'Team Vibranium' })
  @IsString()
  @IsOptional()
  teamName?: string;
}
