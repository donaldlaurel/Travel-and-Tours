"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage, deleteImage, type UploadFolder } from "@/lib/upload"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  label?: string
  value?: string
  onChange: (url: string) => void
  folder: UploadFolder
  className?: string
  aspectRatio?: "square" | "video" | "wide"
}

export function ImageUpload({
  label = "Image",
  value,
  onChange,
  folder,
  className,
  aspectRatio = "video",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[3/1]",
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const result = await uploadImage(file, folder)
      onChange(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleRemove = async () => {
    if (value) {
      // Extract path from URL if it's a Supabase URL
      try {
        const url = new URL(value)
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/)
        if (pathMatch) {
          await deleteImage(pathMatch[1])
        }
      } catch {
        // URL parsing failed, just clear the value
      }
      onChange("")
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        <div className={cn("relative rounded-lg overflow-hidden border bg-muted", aspectClasses[aspectRatio])}>
          <Image
            src={value || "/placeholder.svg"}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            aspectClasses[aspectRatio],
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            uploading && "pointer-events-none opacity-50"
          )}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-medium">Click or drag to upload</span>
                <span className="text-xs">PNG, JPG, WebP up to 5MB</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL Input as fallback */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Or paste image URL"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Multiple images upload component
interface MultiImageUploadProps {
  label?: string
  values: string[]
  onChange: (urls: string[]) => void
  folder: UploadFolder
  maxImages?: number
  className?: string
}

export function MultiImageUpload({
  label = "Images",
  values,
  onChange,
  folder,
  maxImages = 10,
  className,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelect = async (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) return false
      if (file.size > 5 * 1024 * 1024) return false
      return true
    })

    if (validFiles.length === 0) {
      setError("No valid images selected")
      return
    }

    const remaining = maxImages - values.length
    const filesToUpload = validFiles.slice(0, remaining)

    if (filesToUpload.length < validFiles.length) {
      setError(`Only ${remaining} more images allowed`)
    }

    setUploading(true)
    setError(null)

    try {
      const newUrls: string[] = []
      for (const file of filesToUpload) {
        const result = await uploadImage(file, folder)
        newUrls.push(result.url)
      }
      onChange([...values, ...newUrls])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index)
    onChange(newValues)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesSelect(e.target.files)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {values.map((url, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-muted group">
            <Image
              src={url || "/placeholder.svg"}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-xs">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {values.length} / {maxImages} images
      </p>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
