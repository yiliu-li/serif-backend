import { Module } from '@nestjs/common';
import { InvitationCodesService } from './invitation-codes.service';
import { InvitationCodesController } from './invitation-codes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InvitationCodesController],
  providers: [InvitationCodesService],
  exports: [InvitationCodesService],
})
export class InvitationCodesModule {}
