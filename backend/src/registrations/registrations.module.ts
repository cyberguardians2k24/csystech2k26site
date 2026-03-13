import { Module } from '@nestjs/common';
import { RegistrationsService }    from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { R2UploadService } from './r2-upload.service';
import { RegistrationEmailService } from './registration-email.service';

@Module({
  controllers: [RegistrationsController],
  providers:   [RegistrationsService, R2UploadService, RegistrationEmailService],
  exports:     [RegistrationsService],
})
export class RegistrationsModule {}
