import { type Request, type Response } from 'express'
import { type IProduct } from '../../../types/IProduct'
import { responseCustomError } from '../../../utils/CustomError'
import { imagesValidate } from '../../../utils/validations'
import ProductManager from '../managers/ProductManager'

const product = new ProductManager()

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
  } catch (err) {
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

export async function addProduct(req: Request, res: Response): Promise<void> {
  const { title, description, code, stock, price, category } = req.body

  try {
    const newProduct: IProduct = {
      title,
      description,
      code,
      stock: parseInt(stock),
      price: parseInt(price),
      category,
      thumbnails: imagesValidate(req),
      status: true
    }

    const data = await product.addProduct(newProduct)
    res.status(200).json({
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
    const updateProduct: IProduct = {
      title,
      description,
      code,
      stock,
      price,
      category,
      thumbnails: imagesValidate(req),
      status: true
    }

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
