import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { AuthTwitterController } from './auth-twitter.controller';
import { AuthTwitterService } from './auth-twitter.service';

@Module({
  controllers: [AuthTwitterController],
  exports: [AuthTwitterService],
  imports: [ConfigModule, AuthModule],
  providers: [AuthTwitterService],
})
export class AuthTwitterModule {}
