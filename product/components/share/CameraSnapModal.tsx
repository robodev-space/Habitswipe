"use client"

import { useState, useRef, useEffect } from "react"
import { toBlob } from "html-to-image"
import { Camera, RefreshCw, Share2, X, Upload, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { API_ROUTES } from "@/lib/constants/api-routes"

interface CameraSnapModalProps {
  habit: { id: string; name: string; icon: string; currentStreak: number }
  onClose: () => void
  onShareSuccess: () => void
}

export function CameraSnapModal({ habit, onClose, onShareSuccess }: CameraSnapModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const snapRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err: any) {
      console.error("Camera error:", err)
      setError("Unable to access camera. You can upload an image instead.")
    }
  }

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  // Handle Capture
  const handleCapture = async () => {
    if (!snapRef.current) return
    setIsProcessing(true)

    // Pause video to use it as a static background during html-to-image process
    if (videoRef.current && !uploadedImage) {
      videoRef.current.pause()
    }

    try {
      // Small timeout to ensure DOM is ready and video is perfectly paused
      await new Promise(r => setTimeout(r, 100))

      const blob = await toBlob(snapRef.current, { cacheBust: true, pixelRatio: 2 })
      if (!blob) throw new Error("Failed to generate image")

      const file = new File([blob], `snap-${Date.now()}.png`, { type: "image/png" })

      if (navigator.share) {
        await navigator.share({
          title: "My Habit Streak!",
          text: `I just completed my habit: ${habit.name}! 🔥`,
          files: [file],
        })

        // Log the share success
        await fetch(API_ROUTES.SNAPS.BASE, { method: "POST" })
        onShareSuccess()
        onClose()
      } else {
        // Fallback for desktop/non-supported browsers
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = file.name
        a.click()
        URL.revokeObjectURL(downloadUrl)

        await fetch(API_ROUTES.SNAPS.BASE, { method: "POST" })
        onShareSuccess()
        onClose()
      }
    } catch (err) {
      console.error("Share failed", err)
      alert("Something went wrong while trying to share!")
    } finally {
      setIsProcessing(false)
      if (videoRef.current && !uploadedImage) {
        videoRef.current.play()
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    stopCamera() // Stop webcam if user opts for upload
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">

      {/* Container to capture */}
      <div
        ref={snapRef}
        className={cn(
          "relative overflow-hidden rounded-3xl shadow-2xl flex flex-col items-center justify-center bg-black",
          "w-full max-w-md aspect-[3/4]"
        )}
      >
        {/* Background Layer: Either Uploaded Image or Video */}
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Uploaded background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Glassmorphic Stats Overlay */}
        <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl pointer-events-none text-white">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              {habit.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">{habit.name}</h3>
              <p className="opacity-80 text-sm">HabitClick Daily Challenge</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 inline-flex px-3 py-1.5 rounded-lg bg-orange-500/80 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-white" fill="white" />
            <span className="font-bold text-sm text-white">{habit.currentStreak} Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Controls Overlay (Not captured in image) */}
      <div className="fixed inset-x-0 bottom-0 p-6 flex flex-col gap-6 items-center">
        {error && <p className="text-red-400 text-sm font-medium bg-black/50 px-3 py-1 rounded-md">{error}</p>}

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-surface/40 transition-all border border-white/10"
            disabled={isProcessing}
          >
            <Upload className="w-5 h-5" />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />

          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 group transition-transform active:scale-95 disabled:opacity-50"
          >
            <div className="w-full h-full rounded-full bg-white group-hover:bg-indigo-500 transition-colors flex items-center justify-center">
              {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin text-black group-hover:text-white" /> : <Share2 className="w-8 h-8 text-black group-hover:text-white" />}
            </div>
          </button>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-surface/40 transition-all border border-white/10"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  )
}
