import { v2 as cloudinary } from 'cloudinary'
import { type Request } from 'express'
import { type IProduct, type IThumbnail } from '../types/IProduct'

export interface UploadedImage {
  name: string
  path: string
}

// Función de carga de imágenes
export const uploadImages = async (req: Request): Promise<UploadedImage[]> => {
  const images = req.files
  if (!Array.isArray(images)) return []

  const uploadPromises = images.map(async (image: Express.Multer.File) => {
    try {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'ecommerce_coder', // Subir a una carpeta específica
        overwrite: true, // Sobrescribir imágenes existentes con el mismo nombre
        use_filename: true,
        public_id: image.originalname,
        unique_filename: false,
        format: 'webp'
      })

      const uploadedImage: UploadedImage = {
        name: result.public_id,
        path: result.secure_url
      }
      return uploadedImage
    } catch (error: any) {
      return null
    }
  })

  const uploadedImages = await Promise.all(uploadPromises)
    .then((results) => results.filter((result) => result !== null))
    .then((filteredResults) =>
      filteredResults.map((result) => result as UploadedImage)
    )

  return uploadedImages
}

export async function buildUpdateProduct(
  title: string,
  description: string,
  code: string,
  stock: number,
  price: number,
  category: string,
  thumbnails: IThumbnail[]
): Promise<IProduct> {
  const updateProduct: IProduct = {
    title,
    description,
    code,
    stock: typeof stock === 'string' ? parseInt(stock) : stock,
    price: typeof price === 'string' ? parseInt(price) : price,
    category,
    status: true
  }
  if (thumbnails.length > 0) {
    updateProduct.thumbnails = thumbnails
  }
  return updateProduct
}
