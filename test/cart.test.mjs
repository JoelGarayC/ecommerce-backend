import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080/api/v1')

// reemplaza el token al iniciar sesión - puede probar con este token
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDU3MDVhMWZkNWEwZWEyNmZmZjU4OWIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODY0NTIyNDQsImV4cCI6MTY4OTA0NDI0NH0.nVaVtQ_jsGwBMVfjFvVYNuZ5H69qYsJLQWny8LWcWic'
const cartId = '64571076d8636995d87bffe3'

describe('Carts API', () => {
  describe('GET /carts', () => {
    it('should return all carts', async () => {
      const response = await request
        .get('/carts')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.carts).to.be.an('array')
    })
  })

  describe('GET /carts/:cid', () => {
    it('should return a specific cart', async () => {
      const response = await request
        .get(`/carts/${cartId}`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.cart).to.be.an('object')
    })
  })

  describe('POST /carts', () => {
    it('should create a new cart', async () => {
      const response = await request.post('/carts')

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })

  describe('POST /carts/:cid/products/:pid', () => {
    it('should add a product to a cart', async () => {
      const productId = '6462e05059f4015227b254f9'

      const response = await request
        .post(`/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })

  describe('PUT /carts/:cid/products/:pid', () => {
    it('should update a product in the cart', async () => {
      const productId = '6462e05059f4015227b254f9'
      const quantity = 100

      const response = await request
        .put(`/carts/${cartId}/products/${productId}`)
        .send({ quantity })
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })

  describe('PUT /carts/:cid/products', () => {
    it('should update multiple products in the cart', async () => {
      const updatedProducts = [
        { product: '6462e05059f4015227b254f9', quantity: 50 },
        { product: '6462e05059f4015227b254fe', quantity: 100 }
      ]

      const response = await request
        .put(`/carts/${cartId}`)
        .send(updatedProducts)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })

  describe('DELETE /carts/:cid/products/:pid', () => {
    it('should delete a product from the cart', async () => {
      const productId = '6462e05059f4015227b254fe'

      const response = await request
        .delete(`/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })

  describe('DELETE /carts/:cid', () => {
    it('should delete all products from the cart', async () => {
      const response = await request
        .delete(`/carts/${cartId}`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })
})
