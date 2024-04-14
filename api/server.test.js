const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('Auth Router Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: 'newPass123' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'newUser');
      expect(res.body).toHaveProperty('password'); 
    });

    it('should return 400 if username or password is missing', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'newUser' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials and return a token', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'newUser', password: 'newPass123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: 'newPass123' });

      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'newUser', password: 'wrongPassword' });
      expect(res.status).toBe(401); 
      expect(res.body).toHaveProperty('message', 'invalid credentials');
    });
  });
});
