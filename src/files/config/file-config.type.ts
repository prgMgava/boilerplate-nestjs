export type FileConfig = {
  accessKeyId?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  driver: string;
  maxFileSize: number;
  secretAccessKey?: string;
};
