import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an event' })
  create(@Body() dto: CreateEventDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active events' })
  findAll(@Query('includeInactive') includeInactive = 'false') {
    return this.svc.findAll(includeInactive === 'true');
  }

  @Get('seed')
  @ApiOperation({ summary: 'Seed default events' })
  seed() {
    return this.svc.seed();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get event by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
