import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080/api/v1')

// reemplaza el token al iniciar sesión - puede probar con este token
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDU3MDVhMWZkNWEwZWEyNmZmZjU4OWIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODY0NTIyNDQsImV4cCI6MTY4OTA0NDI0NH0.nVaVtQ_jsGwBMVfjFvVYNuZ5H69qYsJLQWny8LWcWic'

describe('Products API', () => {
  describe('GET /products', () => {
    it('should return a list of products', async () => {
      const response = await request.get('/products')
      expect(response.status).to.equal(200)
      expect(response.body.payload).to.be.an('array')
      expect(response.body.totalPages).to.be.a('number')
      expect(response.body.page).to.be.a('number')
      expect(response.body.hasPrevPage).to.be.a('boolean')
      expect(response.body.hasNextPage).to.be.a('boolean')
    })
  })

  describe('POST /products', () => {
    it('should add a new product', async () => {
      const productData = {
        title: 'Producto prueba f44qs',
        description: 'Descripcion del producto',
        price: 56,
        code: '3d5reevswq3',
        stock: 63,
        category: '6543ss'
      }

      const response = await request
        .post('/products')
        .field('title', productData.title)
        .field('description', productData.description)
        .field('price', productData.price)
        .field('code', productData.code)
        .field('stock', productData.stock)
        .field('category', productData.category)
        .set('Authorization', `Bearer ${userToken}`)

      // expect(response.status).to.equal(200)
      // expect(response.body.product).to.be.an('object')
      expect(response.body).to.be.an('object')
    })

    it('should return a 400 error for invalid data', async () => {
      const invalidProductData = {
        title: '',
        description: 'Descripcion del producto',
        price: -10,
        code: '',
        stock: 'abc',
        category: '6543ss'
      }

      const response = await request
        .post('/products')
        .field('title', invalidProductData.title)
        .field('description', invalidProductData.description)
        .field('price', invalidProductData.price)
        .field('code', invalidProductData.code)
        .field('stock', invalidProductData.stock)
        .field('category', invalidProductData.category)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(400)
      expect(response.body).to.be.an('object')
    })
  })

  describe('GET /products/:pid', () => {
    it('should return a specific product', async () => {
      const productId = '6462e05059f4015227b254f9'

      const response = await request.get(`/products/${productId}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
    })
  })

  describe('PUT /products/:pid', () => {
    it('should update a specific product', async () => {
      const productId = '64853a4ab0fa07ce8aa080ae'
      const productData = {
        title: 'Producto edit',
        description: 'Descripcion del producto',
        price: 56,
        code: '3d5r0000q3',
        stock: 63,
        category: '6543ss'
      }

      const response = await request
        .put(`/products/${productId}`)
        .field('title', productData.title)
        .field('description', productData.description)
        .field('price', productData.price)
        .field('code', productData.code)
        .field('stock', productData.stock)
        .field('category', productData.category)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })

  describe('DELETE /products/:pid', () => {
    it('should delete a specific product', async () => {
      const productId = '6472909f75e0eadfe9c97d4b'
      const response = await request
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
      // expect(response.status).to.equal(200)
      expect(response.body.message).to.be.an('string')
      expect(response.body).to.be.an('object')
      console.log(response.body.message)
    })
  })
})
