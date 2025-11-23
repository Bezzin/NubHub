import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client (S3-compatible)
const getR2Client = () => {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error('Missing Cloudflare R2 credentials in environment variables');
  }

  return new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';

/**
 * Upload image to Cloudflare R2
 * @param fileBuffer - Image file buffer
 * @param fileName - Unique filename (include extension)
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns Public URL of uploaded image (not accessible without signed URL)
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME not configured');
  }

  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: {
      uploadedAt: new Date().toISOString(),
    },
  });

  await client.send(command);

  // Return the object key (filename) - we'll generate signed URLs when needed
  return fileName;
}

/**
 * Generate a signed URL for accessing an image (expires in 24 hours)
 * @param fileName - The filename/key in R2
 * @returns Presigned URL valid for 24 hours
 */
export async function getSignedImageUrl(fileName: string): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME not configured');
  }

  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  // Generate signed URL valid for 24 hours (86400 seconds)
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 86400 });

  return signedUrl;
}

/**
 * Generate unique filename for uploaded image
 * @param originalName - Original filename from upload
 * @returns Unique filename with timestamp and random string
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';

  return `ultrasounds/${timestamp}-${randomString}.${extension}`;
}

/**
 * Validate image file
 * @param contentType - MIME type of file
 * @param fileSize - File size in bytes
 * @returns Object with isValid and error message
 */
export function validateImage(contentType: string, fileSize: number): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(contentType)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  if (fileSize > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { isValid: true };
}
