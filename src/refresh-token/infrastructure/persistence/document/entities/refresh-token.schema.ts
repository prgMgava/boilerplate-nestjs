import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// in your project and return an schema entity directly in response.
import { HydratedDocument, now } from 'mongoose';

// We use class-transformer in schema and domain entity.
import { EntityDocumentHelper } from '@utils/document-entity-helper';

export type RefreshTokenSchemaDocument =
  HydratedDocument<RefreshTokenSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class RefreshTokenSchemaClass extends EntityDocumentHelper {
  @Prop({ default: now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({
    type: String,
    unique: true,
  })
  browser?: string;

  @Prop()
  expires: Date;

  @Prop({
    type: String,
  })
  ip?: string;

  @Prop()
  isRevoked?: boolean;

  @Prop()
  os?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  userId: number;

  @Prop({ default: now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(RefreshTokenSchemaClass);
