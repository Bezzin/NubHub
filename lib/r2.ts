import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const getR2Client = () => {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error('Missing Cloudflare R2 credentials in environment variables')
  }

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || ''

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME not configured')
  }

  const client = getR2Client()

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: {
      uploadedAt: new Date().toISOString(),
    },
  })

  await client.send(command)

  return fileName
}

export async function getSignedImageUrl(fileName: string): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME not configured')
  }

  const client = getR2Client()

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  })

  return getSignedUrl(client, command, { expiresIn: 86400 })
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || 'jpg'

  return `ultrasounds/${timestamp}-${randomString}.${extension}`
}

export function validateImage(
  contentType: string,
  fileSize: number
): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(contentType)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    }
  }

  if (fileSize > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Maximum size is 10MB.',
    }
  }

  return { isValid: true }
}
