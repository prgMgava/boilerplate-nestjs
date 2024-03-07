import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthFacebookService } from './auth-facebook.service';

@Module({
  controllers: [AuthFacebookController],
  exports: [AuthFacebookService],
  imports: [ConfigModule, AuthModule],
  providers: [AuthFacebookService],
})
export class AuthFacebookModule {}
