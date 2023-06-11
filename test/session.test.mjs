import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080/api/v1/sessions')

describe('Session API', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const user = {
        firstName: 'Joel',
        lastName: 'Example',
        email: 'example4@example.com',
        password: 'password123',
        age: 25
      }

      const response = await request.post('/register').send(user)
      expect(response.status).to.equal(201)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.equal('usuario registrado')
      expect(response.body.token).to.be.a('string')
      expect(response.body.expiresIn).to.be.a('number')
    })
  })

  describe('POST /login', () => {
    it('should log in a user', async () => {
      const credentials = {
        email: 'example@example.com',
        password: 'password123'
      }

      const response = await request.post('/login').send(credentials)

      expect(response.status).to.equal(201)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.equal('sesión iniciada')
      expect(response.body.token).to.be.a('string')
      expect(response.body.expiresIn).to.be.a('number')
    })
  })

  describe('GET /current', () => {
    it('should get the current user', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDg1NGFhNWIwZmEwN2NlOGFhMDhjM2MiLCJyb2xlIjoidXNlciIsImlhdCI6MTY4NjQ1Njk5NywiZXhwIjoxNjg5MDQ4OTk3fQ.6Gb4fPC3Adqd_6UH4qsqzDJLQpMIdiZxYox2MjgNZxw'

      const response = await request
        .get('/current')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).to.equal(201)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.user).to.be.an('object')
    })
  })

  describe('POST /logout', () => {
    it('should log out the user', async () => {
      const response = await request.post('/logout')

      expect(response.status).to.equal(201)
      expect(response.body).to.be.an('object')
      expect(response.body.status).to.equal('success')
      expect(response.body.message).to.be.a('string')
    })
  })
})
