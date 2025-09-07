import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration
const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;

// Initialize S3 client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export interface UploadResult {
  key: string;
  url: string;
  filename: string;
}

export class R2Service {
  /**
   * Upload a file directly to R2 through the API
   */
  static async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    bucketName: string = R2_BUCKET_NAME,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);
  }

  /**
   * Generate a presigned URL for uploading a file
   */
  static async generateUploadUrl(
    userId: string,
    applicationId: string,
    filename: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; key: string }> {
    const key = `${userId}/${applicationId}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 3600,
    }); // 1 hour

    return { uploadUrl, key };
  }

  /**
   * Generate a presigned URL for downloading a file
   */
  static async generateDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 3600,
    }); // 1 hour

    return signedUrl;
  }

  /**
   * Delete a file from R2
   */
  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  }

  /**
   * Get the public URL for a file (if bucket is public)
   */
  static getPublicUrl(key: string): string {
    const publicUrl = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;

    return publicUrl;
  }
}
