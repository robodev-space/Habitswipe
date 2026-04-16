// lib/services/storage.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// STORAGE SERVICE
// Centralized service for GCS operations (upload, signed URLs)
// ─────────────────────────────────────────────────────────────────────────────

import { Storage } from "@google-cloud/storage"

class StorageService {
  private static instance: StorageService
  private storage: Storage
  private bucketName: string

  private constructor() {
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    })
    this.bucketName = process.env.GCS_BUCKET_NAME || "HabitClick-avatars"
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  /**
   * Uploads a base64 image to GCS
   */
  async uploadBase64(base64String: string, fileName: string): Promise<string> {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 string")
    }

    const mimeType = matches[1]
    const buffer = Buffer.from(matches[2], "base64")
    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(fileName)

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        cacheControl: "public, max-age=31536000",
      },
      resumable: false,
    })

    return fileName // Return the path
  }

  /**
   * Generates a signed URL for a private file
   */
  async getAuthenticatedUrl(fileName: string): Promise<string> {
    if (!fileName) return ""
    if (fileName.startsWith("http")) return fileName

    try {
      const bucket = this.storage.bucket(this.bucketName)
      const file = bucket.file(fileName)
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
      })
      return url
    } catch (err) {
      console.error("[STORAGE_SERVICE_SIGNED_URL_ERROR]", err)
      return ""
    }
  }
}

export const storageService = StorageService.getInstance()
