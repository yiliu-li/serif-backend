import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InvitationCodesService } from './invitation-codes.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('invitation-codes')
export class InvitationCodesController {
  constructor(private readonly invitationCodesService: InvitationCodesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create() {
    return this.invitationCodesService.generateCode();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.invitationCodesService.findAll();
  }
}
