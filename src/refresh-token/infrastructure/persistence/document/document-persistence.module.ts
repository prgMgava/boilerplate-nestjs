import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RefreshTokenRepository } from '../refresh-token.repository';
import {
  RefreshTokenSchemaClass,
  UserSchema,
} from './entities/refresh-token.schema';
import { RefreshTokensDocumentRepository } from './repositories/refresh-token.repository';

@Module({
  exports: [RefreshTokenRepository],
  imports: [
    MongooseModule.forFeature([
      { name: RefreshTokenSchemaClass.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokensDocumentRepository,
    },
  ],
})
export class DocumentUserPersistenceModule {}
