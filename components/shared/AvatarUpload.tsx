"use client"

// components/shared/AvatarUpload.tsx
// ─────────────────────────────────────────────────────────────────────────────
// AVATAR UPLOAD — Click to select image, preview, crop to circle, upload
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useEffect } from "react"
import { Camera, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  currentImage: string | null
  name: string | null
  onUpload: (imageDataUrl: string) => Promise<void>
}

export function AvatarUpload({ currentImage, name, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate type
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, WebP allowed")
      return
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB")
      return
    }

    // Read and resize to 256x256
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const originalDataUrl = ev.target?.result as string

      // Resize using canvas
      const img = new Image()
      img.onload = async () => {
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")!

        // Draw as circle crop (square → circle via CSS, actual data is square)
        const size = Math.min(img.width, img.height)
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256)

        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.85)
        setPreview(resizedDataUrl)

        // Upload
        setIsUploading(true)
        try {
          await onUpload(resizedDataUrl)
        } catch {
          setError("Upload failed. Try again.")
          setPreview(currentImage)
        } finally {
          setIsUploading(false)
        }
      }
      img.src = originalDataUrl
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be re-selected
    e.target.value = ""
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        {/* Avatar circle */}
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt={name ?? "Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Camera badge */}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-md hover:bg-indigo-600 transition-colors"
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <p className="text-xs text-fore-3">
        Click to upload · JPEG, PNG, WebP · Max 2MB
      </p>
    </div>
  )
}
