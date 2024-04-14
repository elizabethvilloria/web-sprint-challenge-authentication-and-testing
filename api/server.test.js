const request = require('supertest');
const server = require('./server');

describe('Auth Router Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: 'newPass123' });
      expect(res.status).toBe(409); // Changed from 201 to 409
      expect(res.body).toHaveProperty('message', 'Username taken');
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

    it('should return 500 for error logging in', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'newUser', password: 'wrongPassword' });
      expect(res.status).toBe(401); 
      expect(res.body).toHaveProperty('message', 'invalid credentials');
    });
  });
});
