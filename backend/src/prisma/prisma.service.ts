import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to PostgreSQL');
    } catch (error: any) {
      this.logger.error('Prisma failed to connect to PostgreSQL during startup.');
      this.logger.error('Check DATABASE_URL in backend/.env and verify PostgreSQL is running.');
      if (error?.code) {
        this.logger.error(`Prisma error code: ${error.code}`);
      }
      this.logger.error(error?.message ?? 'Unknown Prisma connection error');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
