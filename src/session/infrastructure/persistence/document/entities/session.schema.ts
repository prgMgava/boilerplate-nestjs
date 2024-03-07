import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { EntityDocumentHelper } from '@utils/document-entity-helper';
import mongoose, { HydratedDocument, now } from 'mongoose';

import { UserSchemaClass } from '@users/infrastructure/persistence/document/entities/user.schema';

export type SessionSchemaDocument = HydratedDocument<SessionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class SessionSchemaClass extends EntityDocumentHelper {
  @Prop({ default: now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ ref: 'UserSchemaClass', type: mongoose.Schema.Types.ObjectId })
  user: UserSchemaClass;
}

export const SessionSchema = SchemaFactory.createForClass(SessionSchemaClass);

SessionSchema.index({ user: 1 });
