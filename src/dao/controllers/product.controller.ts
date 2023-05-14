/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type NextFunction, type Request, type Response } from 'express'
import { type IProduct } from '../../types/IProduct'
import { responseCustomError } from '../../utils/CustomError'
import { buildUpdateProduct, uploadImages } from '../../utils/uploadImagesCloud'
import ProductDTO from '../DTOs/Product.dto'

// OPCION MEMORY  => comentar la linea siguiente y descomentar el que sigue
import ProductService from '../mongo/services/product.service'
// import ProductService from '../memory/services/product.service'

const product = new ProductService()

export async function getProducts(req: Request, res: Response): Promise<void> {
  const limit = req.query.limit as string
  const page = req.query.page as string
  const sort = req.query.sort as string
  const query = req.query.query as string

  try {
    const data = await product.getProducts({ limit, page, sort, query })

    res.status(200).json({
      status: 'success',
      payload: data.docs,
      totalPages: Math.ceil(data.totalDocs / data.limit),
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: !data.hasPrevPage ? null : data.prevUrl,
      nextLink: !data.hasNextPage ? null : data.nextUrl
    })
  } catch (err: any) {
    responseCustomError(res, err)
  }
}

export async function getProductById(
  req: Request,
  res: Response
): Promise<void> {
  const { pid } = req.params

  try {
    const data = await product.getProductById(pid)
    res.status(200).json({
      status: 'success',
      product: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function addProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { title, description, code, stock, price, category } = req.body

  try {
    const newProduct: IProduct = {
      title,
      description,
      code,
      stock: typeof stock === 'string' ? parseInt(stock) : stock,
      price: typeof price === 'string' ? parseInt(price) : price,
      category,
      thumbnails: (await uploadImages(req)) ?? [],
      status: true
    }

    const productDTO = new ProductDTO(newProduct)

    const data = await product.addProduct(productDTO)
    res.status(201).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function updateProductById(
  req: Request,
  res: Response
): Promise<void> {
  const { title, description, code, stock, price, category } = req.body
  const { pid } = req.params

  try {
    const images = await uploadImages(req)
    const updateProduct = await buildUpdateProduct(
      title,
      description,
      code,
      stock,
      price,
      category,
      images
    )

    const data = await product.updateProduct(pid, updateProduct)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function deleteProductById(
  req: Request,
  res: Response
): Promise<void> {
  const { pid } = req.params

  try {
    const data = await product.deleteProduct(pid)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
