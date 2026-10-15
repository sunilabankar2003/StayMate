const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Property = require('../src/models/Property');

let ownerToken;
let studentToken;
let adminToken;
let testPropertyId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staymate_db');

  // Login owner
  const ownerRes = await request(app).post('/api/auth/login').send({
    email: 'owner1@staymate.com',
    password: 'Owner@123',
  });
  ownerToken = ownerRes.body.token;

  // Login student
  const studentRes = await request(app).post('/api/auth/login').send({
    email: 'student1@staymate.com',
    password: 'Student@123',
  });
  studentToken = studentRes.body.token;

  // Login admin
  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin@staymate.com',
    password: 'Admin@123',
  });
  adminToken = adminRes.body.token;
});

afterAll(async () => {
  if (testPropertyId) {
    await Property.findByIdAndDelete(testPropertyId);
  }
  await mongoose.connection.close();
});

describe('Property Module Flow', () => {
  test('GET /api/properties should return approved properties with pagination', async () => {
    const res = await request(app).get('/api/properties?city=Bangalore');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    // All public properties must be approved
    res.body.data.forEach((p) => {
      expect(p.verificationStatus).toBe('approved');
    });
  });

  test('POST /api/properties should allow owner to create property (pending verification)', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Jest Automation PG for Rent',
        description: 'Clean and automated test PG for verification testing',
        propertyType: 'PG',
        monthlyRent: 8000,
        securityDeposit: 16000,
        address: '100 Feet Ring Road',
        locality: 'BTM Layout',
        city: 'Bangalore',
        amenities: ['WiFi', 'Power Backup'],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verificationStatus).toBe('pending');
    testPropertyId = res.body.data._id;
  });

  test('POST /api/properties should block student from creating property (Role restriction)', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Unauthorized student property',
        description: 'Should fail 403',
        propertyType: 'Flat',
        monthlyRent: 9000,
        address: 'Somewhere',
        locality: 'Area',
        city: 'Bangalore',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('PATCH /api/admin/properties/:id/verify should allow admin to approve property', async () => {
    const res = await request(app)
      .patch(`/api/admin/properties/${testPropertyId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.verificationStatus).toBe('approved');
  });

  test('GET /api/properties/:id should return property details with populated owner', async () => {
    const res = await request(app).get(`/api/properties/${testPropertyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Jest Automation PG for Rent');
    expect(res.body.data.owner.name).toBeDefined();
  });
});
