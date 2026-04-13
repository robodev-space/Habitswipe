// app/api/profile/avatar/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/profile/avatar — Upload profile picture
// Accepts base64 image, validates size/type, stores as data URL in user.image
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { storageService } from "@/lib/services/storage.service"

const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { image } = await req.json()

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate it's a proper base64 data URL
    const match = image.match(/^data:(image\/([a-zA-Z+]+));base64,(.+)$/)
    if (!match) {
      return NextResponse.json(
        { error: "Invalid image format. Must be base64 data URL" },
        { status: 400 }
      )
    }

    const fullMimeType = match[1]
    const extension = match[2].replace("jpeg", "jpg")
    const base64Data = match[3]

    // Validate mime type
    if (!ALLOWED_TYPES.includes(fullMimeType)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      )
    }

    // Validate file size
    const sizeBytes = Buffer.byteLength(base64Data, "base64")
    if (sizeBytes > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 2MB" },
        { status: 400 }
      )
    }

    // 1. Upload to Google Cloud Storage via Service
    const fileName = `Avatar/${session.user.id}-${Date.now()}.${extension}`
    await storageService.uploadBase64(image, fileName)

    // 2. Save only the PATH to user.image
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: fileName },
      select: { id: true, image: true },
    })

    // 3. Return a SIGNED URL for immediate UI update
    const signedUrl = await storageService.getAuthenticatedUrl(fileName)

    return NextResponse.json({ data: { image: signedUrl } })
  } catch (err) {
    console.error("[AVATAR_UPLOAD_ERROR]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
