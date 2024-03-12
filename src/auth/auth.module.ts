import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailModule } from '@mail/mail.module';

import { RefreshTokenModule } from '@refresh-token/refresh-token.module';
import { SessionModule } from '@session/session.module';
import { UsersModule } from '@users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
    RefreshTokenModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
})
export class AuthModule {}
