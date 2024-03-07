import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { S3Client } from '@aws-sdk/client-s3';
import { diskStorage } from 'multer';
import multerS3 from 'multer-s3';

import { AllConfigType } from '@config/config.type';
import { DatabaseConfig } from '@database/config/database-config.type';
import databaseConfig from '@database/config/database.config';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DocumentFilePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalFilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentFilePersistenceModule
  : RelationalFilePersistenceModule;

@Module({
  controllers: [FilesController],
  exports: [FilesService, infrastructurePersistenceModule],
  imports: [
    infrastructurePersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const storages = {
          local: () =>
            diskStorage({
              destination: './files',
              filename: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            }),
          s3: () => {
            const s3 = new S3Client({
              credentials: {
                accessKeyId: configService.getOrThrow('file.accessKeyId', {
                  infer: true,
                }),
                secretAccessKey: configService.getOrThrow(
                  'file.secretAccessKey',
                  { infer: true },
                ),
              },
              region: configService.get('file.awsS3Region', { infer: true }),
            });

            return multerS3({
              acl: 'public-read',
              bucket: configService.getOrThrow('file.awsDefaultS3Bucket', {
                infer: true,
              }),
              contentType: multerS3.AUTO_CONTENT_TYPE,
              key: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
              s3: s3,
            });
          },
        };

        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new HttpException(
                  {
                    errors: {
                      file: `cantUploadFileType`,
                    },
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
                false,
              );
            }

            callback(null, true);
          },
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
          storage:
            storages[
              configService.getOrThrow('file.driver', { infer: true })
            ](),
        };
      },
    }),
  ],
  providers: [ConfigModule, ConfigService, FilesService],
})
export class FilesModule {}
