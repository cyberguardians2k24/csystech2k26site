import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule }        from './prisma/prisma.module';
import { ParticipantsModule }  from './participants/participants.module';
import { EventsModule }        from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { AdminModule }         from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ParticipantsModule,
    EventsModule,
    RegistrationsModule,
    AdminModule,
  ],
})
export class AppModule {}
