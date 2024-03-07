import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';

@Module({
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
  imports: [ConfigModule, AuthModule],
  providers: [AuthGoogleService],
})
export class AuthGoogleModule {}
