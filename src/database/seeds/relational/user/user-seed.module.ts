import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@users/infrastructure/persistence/relational/entities/user.entity';

import { UserSeedService } from './user-seed.service';

@Module({
  exports: [UserSeedService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserSeedService],
})
export class UserSeedModule {}
