import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSchema,
  UserSchemaClass,
} from '@users/infrastructure/persistence/document/entities/user.schema';

import { UserSeedService } from './user-seed.service';

@Module({
  exports: [UserSeedService],
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchemaClass.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserSeedService],
})
export class UserSeedModule {}
