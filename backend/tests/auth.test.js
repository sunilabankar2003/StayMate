const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staymate_db');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication & User Flow', () => {
  const testUser = {
    name: 'Test Student',
    email: 'test_student_unique@staymate.com',
    password: 'Password@123',
    role: 'student',
    phone: '9988776655',
  };

  afterEach(async () => {
    await User.deleteMany({ email: 'test_student_unique@staymate.com' });
  });

  test('POST /api/auth/register should register a new student user and return token in cookie and body', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.password).toBeUndefined(); // Password must not be returned
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('POST /api/auth/register should fail on duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login should authenticate valid user', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@staymate.com',
        password: 'invalidPassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me should return current user when authenticated', async () => {
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(testUser.email.toLowerCase());
  });

  test('GET /api/auth/me should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
