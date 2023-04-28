import { type Request, type Response } from 'express'
import ProductService from '../services/product.service'

const product = new ProductService()

export async function getProducts(req: Request, res: Response): Promise<void> {
  const limit = parseInt(req.params.limit)
  try {
    const products = await product.getProducts()
    if (limit !== undefined) {
      const limitProducts = products.slice(0, limit)
      res.json({
        ok: true,
        message: 'Lista de productos filtrada',
        products: limitProducts
      })
      return
    }
    res.json({
      ok: true,
      message: 'Lista de productos',
      products
    })
  } catch (err: any) {
    res.json({ error: err.message })
  }
}

export async function getProductById(
  req: Request,
  res: Response
): Promise<void> {
  const { pid } = req.params
  try {
    const response = await product.getProductById(pid)
    res.json({
      ok: true,
      product: response
    })
  } catch (err: any) {
    res.json({ error: err.message })
  }
}

export async function addProduct(req: Request, res: Response): Promise<void> {
  const { title, description, code, stock, price, category, thumbnails } =
    req.body
  try {
    const stockNumber = parseInt(stock)
    const priceNumber = parseInt(price)
    const newProduct = {
      title,
      description,
      code,
      stock: stockNumber,
      price: priceNumber,
      thumbnails,
      category,
      status: true
    }

    const response = await product.addProduct(newProduct)
    res.json({ ok: true, message: response })
  } catch (err: any) {
    res.json({ error: err.message })
  }
}

export async function updateProductById(
  req: Request,
  res: Response
): Promise<void> {
  const { title, description, code, stock, price, category, thumbnails } =
    req.body
  const { pid } = req.params
  try {
    const stockNumber = parseInt(stock)
    const priceNumber = parseInt(price)
    const updateProduct = {
      title,
      description,
      code,
      stock: stockNumber,
      price: priceNumber,
      thumbnails,
      category,
      status: true
    }

    const response = await product.updateProduct(pid, updateProduct)
    res.json({ ok: true, message: response })
  } catch (err: any) {
    res.json({ error: err.message })
  }
}

export async function deleteProductById(
  req: Request,
  res: Response
): Promise<void> {
  const { pid } = req.params
  try {
    const response = await product.deleteProduct(pid)
    res.json({
      ok: true,
      message: response
    })
  } catch (err: any) {
    res.json({ error: err.message })
  }
}
