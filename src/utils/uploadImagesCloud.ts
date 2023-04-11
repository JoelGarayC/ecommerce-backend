import { v2 as cloudinary } from 'cloudinary'
import { type Request } from 'express'
import { type IThumbnail } from '../types/IProduct'

export interface UploadedImage {
  public_id: string
  url: string
}

export async function uploadImagesCloud(
  req: Request
): Promise<UploadedImage[]> {
  const images = req.files
  if (!Array.isArray(images)) return []

  const uploadPromises = images.map(async (image: Express.Multer.File) => {
    return await new Promise<UploadedImage>((resolve, reject) => {
      void cloudinary.uploader.upload(
        image.path,
        (error: Error | null, result: any) => {
          if (error !== null && error !== undefined) {
            reject(error)
          } else {
            const uploadedImage: UploadedImage = {
              public_id: result.public_id,
              url: result.url
            }
            resolve(uploadedImage)
          }
        }
      )
    })
  })

  try {
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function uploadImgs(req: Request): Promise<IThumbnail[]> {
  try {
    const uploadedImages = await uploadImagesCloud(req)
    const dataImages = uploadedImages.map((image) => {
      return {
        name: image.public_id,
        path: image.url
      }
    })
    return dataImages
  } catch (err) {
    console.log(err)
    return []
  }
}
