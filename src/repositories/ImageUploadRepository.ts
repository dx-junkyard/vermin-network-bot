import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import { Readable } from 'stream';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

const s3 = new S3Client({
  region: process.env.S3_REGION || '',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
});

export const uploadImage = async (
  imageId: string,
  binary: Readable
): Promise<string> => {
  const fileName = `${createHash('sha256').update(imageId).digest('hex')}.jpg`;
  const params = {
    Bucket: process.env.S3_BUCKET || '',
    Key: fileName,
    Body: binary,
    ContentType: 'image/jpeg',
  };

  await s3.send(new CreateBucketCommand(params));

  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`;
};
