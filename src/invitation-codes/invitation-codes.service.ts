import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class InvitationCodesService {
  constructor(private prisma: PrismaService) {}

  async generateCode() {
    // Generate a unique code. 
    // In production, we might want to retry if collision occurs, but for beta 8 hex chars (4 bytes) is plenty entropy.
    const code = crypto.randomBytes(4).toString('hex').toUpperCase(); 
    return this.prisma.invitationCode.create({
      data: {
        code,
      },
    });
  }

  async findAll() {
    return this.prisma.invitationCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: { usedBy: { select: { email: true, name: true } } },
    });
  }

  async findOne(code: string) {
    return this.prisma.invitationCode.findUnique({
      where: { code },
    });
  }
  
  async markAsUsed(code: string, userId: number) {
    return this.prisma.invitationCode.update({
      where: { code },
      data: { isUsed: true, usedById: userId },
    });
  }
}
