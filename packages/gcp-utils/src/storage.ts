/**
 * Google Cloud Storage integration
 * 
 * Used for storing transcripts, thumbnails, and other static assets.
 */

import { Storage } from '@google-cloud/storage'

const PROJECT_ID = 'regal-scholar-453620-r7'
const BUCKET_NAME = 'scienceviddb-assets' // Adjust bucket name as needed

const storage = new Storage({
  projectId: PROJECT_ID,
})

/**
 * Upload a file to Google Cloud Storage
 * 
 * @param fileName - Name/path of the file in the bucket
 * @param content - File content (Buffer or string)
 * @param contentType - MIME type (optional)
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  fileName: string,
  content: Buffer | string,
  contentType?: string
): Promise<string> {
  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(fileName)
  
  const options: { contentType?: string } = {}
  if (contentType) {
    options.contentType = contentType
  }
  
  await file.save(content, options)
  await file.makePublic() // Make file publicly accessible
  
  return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`
}

/**
 * Download a file from Google Cloud Storage
 * 
 * @param fileName - Name/path of the file in the bucket
 * @returns File content as Buffer
 */
export async function downloadFile(fileName: string): Promise<Buffer> {
  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(fileName)
  
  const [buffer] = await file.download()
  return buffer
}

/**
 * Check if a file exists in Google Cloud Storage
 * 
 * @param fileName - Name/path of the file in the bucket
 * @returns True if file exists, false otherwise
 */
export async function fileExists(fileName: string): Promise<boolean> {
  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(fileName)
  
  const [exists] = await file.exists()
  return exists
}

/**
 * Delete a file from Google Cloud Storage
 * 
 * @param fileName - Name/path of the file in the bucket
 */
export async function deleteFile(fileName: string): Promise<void> {
  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(fileName)
  
  await file.delete()
}

/**
 * Get public URL for a file (if it's public)
 * 
 * @param fileName - Name/path of the file in the bucket
 * @returns Public URL
 */
export function getPublicUrl(fileName: string): string {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`
}

