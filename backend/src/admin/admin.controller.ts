import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AdminCreateDto {
  @ApiProperty() @IsEmail()      email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;
  @ApiProperty() @IsString() @IsNotEmpty() name:     string;
}

class AdminLoginDto {
  @ApiProperty() @IsEmail()      email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;
}

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create admin user' })
  create(@Body() dto: AdminCreateDto) {
    return this.svc.create(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  login(@Body() dto: AdminLoginDto) {
    return this.svc.login(dto.email, dto.password);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  dashboard() {
    return this.svc.getDashboard();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export participant list' })
  export(@Query('event') event?: string) {
    return this.svc.exportParticipants(event);
  }
}
