import { S3 } from "@aws-sdk/client-s3";

export const s3Client = new S3({
  forcePathStyle: false,
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "nyc3",
  credentials: {
    accessKeyId: "DO00EEMBQD2EGDFWHV7A",
    secretAccessKey: "gbFwEXTjlp51MVxl50STP0vetl2Xmcd8eTNiKJokiF0",
  },
});