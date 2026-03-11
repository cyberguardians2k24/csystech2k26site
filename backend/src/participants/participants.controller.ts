import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly svc: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new participant' })
  @ApiResponse({ status: 201, description: 'Participant registered' })
  create(@Body() dto: CreateParticipantDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all participants (paginated)' })
  findAll(
    @Query('page')  page  = '1',
    @Query('limit') limit = '20',
  ) {
    return this.svc.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get participant by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get participant by email' })
  findByEmail(@Param('email') email: string) {
    return this.svc.findByEmail(email);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete participant' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
