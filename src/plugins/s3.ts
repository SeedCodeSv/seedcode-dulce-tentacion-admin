import { S3 } from "@aws-sdk/client-s3";

export const s3Client = new S3({
  forcePathStyle: false,
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "sf03",
  credentials: {
    accessKeyId: "DO00JDTDLKTFQ73DZY2Q",
    secretAccessKey: "DdWXEn4Z3UAb9M4/aZGNI+VrYP/tXsvvPUxQboGr/sY",
  },
});