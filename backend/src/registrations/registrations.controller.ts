import { Controller, Get, Post, Body, Param, Patch, Query, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@ApiTags('registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly svc: RegistrationsService) {}

  @Post()
  @ApiOperation({ summary: 'Register participant for an event' })
  create(@Body() dto: CreateRegistrationDto) {
    return this.svc.create(dto);
  }

  @Post('payment-upload-url')
  @ApiOperation({ summary: 'Create signed URL for uploading payment proof to R2' })
  createPaymentUploadUrl(
    @Body('fileName') fileName: string,
    @Body('contentType') contentType: string,
    @Body('participantEmail') participantEmail: string,
    @Body('event') event: string,
  ) {
    return this.svc.createPaymentUploadUrl({
      fileName,
      contentType,
      participantEmail,
      event,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all registrations (paginated)' })
  @ApiQuery({ name: 'page',  required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.svc.findAll(+page, +limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get registration statistics' })
  getStats() {
    return this.svc.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get registration by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update registration status' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.svc.updateStatus(id, status);
  }

  @Patch(':id/payment')
  @ApiOperation({ summary: 'Update payment verification status' })
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('paymentStatus') paymentStatus: string,
  ) {
    return this.svc.updatePaymentStatus(id, paymentStatus);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete registration' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
