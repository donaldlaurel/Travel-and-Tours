import { createClient } from "@/lib/supabase/client"

export type UploadFolder = "hotels" | "rooms" | "avatars"

interface UploadResult {
  url: string
  path: string
}

export async function uploadImage(
  file: File,
  folder: UploadFolder,
  customFileName?: string
): Promise<UploadResult> {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to upload images")
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = customFileName 
    ? `${customFileName}.${fileExt}`
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path,
  }
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from("images")
    .remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

export async function uploadMultipleImages(
  files: File[],
  folder: UploadFolder
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, folder))
  )
  return results
}

export function getImageUrl(path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from("images").getPublicUrl(path)
  return data.publicUrl
}
