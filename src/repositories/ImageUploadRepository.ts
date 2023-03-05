import { S3 } from 'aws-sdk';
import { createHash } from 'crypto';
import { Readable } from 'stream';

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY || '',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  region: process.env.S3_REGION || '',
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

  await s3.upload(params).promise();

  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`;
};
