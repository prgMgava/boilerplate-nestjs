import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '@roles/infrastructure/persistence/relational/entities/role.entity';

import { RoleSeedService } from './role-seed.service';

@Module({
  exports: [RoleSeedService],
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleSeedService],
})
export class RoleSeedModule {}
