import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { AuthAppleController } from './auth-apple.controller';
import { AuthAppleService } from './auth-apple.service';

@Module({
  controllers: [AuthAppleController],
  exports: [AuthAppleService],
  imports: [ConfigModule, AuthModule],
  providers: [AuthAppleService],
})
export class AuthAppleModule {}
