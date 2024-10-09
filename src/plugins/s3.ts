import { S3 } from '@aws-sdk/client-s3';

export const s3Client = new S3({
  forcePathStyle: false,
  endpoint: 'https://nyc3.digitaloceanspaces.com/',
  region: 'nyc3',
  credentials: {
    accessKeyId: 'DO00XCTG77NFNGFZLWHF',
    secretAccessKey: 'hmKHpZjd8aErE5Ksv7BqTFgwurJI+XBw3j18rvH/Jik',
  },
});
