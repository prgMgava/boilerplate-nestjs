import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityDocumentHelper } from '@utils/document-entity-helper';
import { HydratedDocument } from 'mongoose';

import { AppConfig } from '@config/app-config.type';

import appConfig from '../../../../../config/app.config';

export type FileSchemaDocument = HydratedDocument<FileSchemaClass>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class FileSchemaClass extends EntityDocumentHelper {
  @Prop({
    get: (value) => {
      if (value.indexOf('/') === 0) {
        return (appConfig() as AppConfig).backendDomain + value;
      }

      return value;
    },
  })
  path: string;
}

export const FileSchema = SchemaFactory.createForClass(FileSchemaClass);
