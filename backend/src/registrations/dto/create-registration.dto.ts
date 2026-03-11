import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  /** Participant info (will be upserted) */
  @ApiProperty({ example: 'T\'Challa' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'tchalla@wakanda.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsString() @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Wakanda Institute of Technology' })
  @IsString() @IsNotEmpty()
  college: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  teamName?: string;

  /** Event info */
  @ApiProperty({ example: 'Hackathon' })
  @IsString() @IsNotEmpty()
  event: string;   // either event name or slug

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Base64 payment screenshot data URL' })
  @IsString() @IsNotEmpty()
  paymentScreenshot: string;

  @ApiPropertyOptional({ example: 'UPI-REF-123456' })
  @IsString() @IsOptional()
  paymentRef?: string;
}
