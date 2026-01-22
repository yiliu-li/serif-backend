import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { InvitationCodesService } from '../invitation-codes/invitation-codes.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private invitationCodesService: InvitationCodesService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    };
  }

  async register(data: RegisterDto) {
    const invitation = await this.invitationCodesService.findOne(data.invitationCode);
    if (!invitation) {
      throw new UnauthorizedException('Invalid invitation code');
    }
    if (invitation.isUsed) {
      throw new UnauthorizedException('Invitation code already used');
    }

    const existingUser = await this.usersService.findOne(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.invitationCode === 'ADMIN-SETUP' ? 'ADMIN' : 'USER',
    });
    
    // Mark code as used
    await this.invitationCodesService.markAsUsed(data.invitationCode, user.id);

    const { password, ...result } = user;
    return result;
  }
}
