import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// We use class-transformer in schema and domain entity.
import { EntityDocumentHelper } from '@utils/document-entity-helper';
// in your project and return an schema entity directly in response.
import { Exclude, Expose, Type } from 'class-transformer';
import { HydratedDocument, now } from 'mongoose';

// We duplicate these rules because you can choose not to use adapters
import { AuthProvidersEnum } from '@auth/auth-providers.enum';
import { FileSchemaClass } from '@files/infrastructure/persistence/document/entities/file.schema';
import { Role } from '@roles/domain/role';
import { Status } from '@statuses/domain/status';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({ default: now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  email: null | string;

  @Prop({
    type: String,
  })
  firstName: null | string;

  @Prop({
    type: String,
  })
  lastName: null | string;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password?: string;

  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  photo?: FileSchemaClass | null;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Prop({
    type: Role,
  })
  role?: null | Role;

  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    default: null,
    type: String,
  })
  socialId?: null | string;

  @Prop({
    type: Status,
  })
  status?: Status;

  @Prop({ default: now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});

UserSchema.index({ 'role.id': 1 });
