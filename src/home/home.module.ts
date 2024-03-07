import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  controllers: [HomeController],
  imports: [ConfigModule],
  providers: [HomeService],
})
export class HomeModule {}
