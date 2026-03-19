import { Module } from '@nestjs/common';
import { RegistrationsService }    from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { R2UploadService } from './r2-upload.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [RegistrationsController],
  providers:   [RegistrationsService, R2UploadService],
  exports:     [RegistrationsService],
})
export class RegistrationsModule {}
