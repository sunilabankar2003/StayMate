const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Property = require('../src/models/Property');
const Review = require('../src/models/Review');
const Favorite = require('../src/models/Favorite');
const Report = require('../src/models/Report');

let studentToken;
let student2Token;
let adminToken;
let sampleProperty;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staymate_db');

  const s1Res = await request(app).post('/api/auth/login').send({
    email: 'student1@staymate.com',
    password: 'Student@123',
  });
  studentToken = s1Res.body.token;

  const s2Res = await request(app).post('/api/auth/login').send({
    email: 'student2@staymate.com',
    password: 'Student@123',
  });
  student2Token = s2Res.body.token;

  const aRes = await request(app).post('/api/auth/login').send({
    email: 'admin@staymate.com',
    password: 'Admin@123',
  });
  adminToken = aRes.body.token;

  sampleProperty = await Property.findOne({ verificationStatus: 'approved' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Advanced Features: Roommates, Mess, Reviews, Favorites, Reports', () => {
  test('GET /api/roommates should return compatible roommates with compatibility percentage', async () => {
    const res = await request(app)
      .get('/api/roommates')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(typeof res.body.data[0].compatibility).toBe('number');
      expect(res.body.data[0].breakdown).toBeDefined();
    }
  });

  test('GET /api/mess should return mess services with filters', async () => {
    const res = await request(app).get('/api/mess?city=Bangalore');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/favorites/:propertyId should add and remove property from favorites', async () => {
    // Add
    const addRes = await request(app)
      .post(`/api/favorites/${sampleProperty._id}`)
      .set('Authorization', `Bearer ${student2Token}`);
    expect([200, 201]).toContain(addRes.statusCode);

    // Check
    const checkRes = await request(app)
      .get(`/api/favorites/check/${sampleProperty._id}`)
      .set('Authorization', `Bearer ${student2Token}`);
    expect(checkRes.statusCode).toBe(200);
    expect(checkRes.body.isFavorite).toBe(true);

    // Remove
    const delRes = await request(app)
      .delete(`/api/favorites/${sampleProperty._id}`)
      .set('Authorization', `Bearer ${student2Token}`);
    expect(delRes.statusCode).toBe(200);
  });

  test('POST /api/reviews should prevent duplicate reviews on same property by same user', async () => {
    // Delete existing review if any
    await Review.deleteMany({ property: sampleProperty._id, user: s1Id() });

    const reviewRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${student2Token}`)
      .send({
        propertyId: sampleProperty._id,
        rating: 5,
        comment: 'Great automated test review!',
      });

    expect([201, 400]).toContain(reviewRes.statusCode);

    // Try submitting again -> Should return 400 duplicate review error
    const dupRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${student2Token}`)
      .send({
        propertyId: sampleProperty._id,
        rating: 4,
        comment: 'Attempting duplicate review',
      });

    expect(dupRes.statusCode).toBe(400);
    expect(dupRes.body.message).toMatch(/already submitted a review/i);
  });

  test('POST /api/reports and PATCH /api/admin/reports/:id/resolve should submit and resolve report', async () => {
    const reportRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        reportedItemType: 'Property',
        reportedItemId: sampleProperty._id,
        reason: 'Automated test report',
        details: 'Testing administrative report moderation',
      });

    expect(reportRes.statusCode).toBe(201);
    const reportId = reportRes.body.data._id;

    // Admin resolves report
    const resolveRes = await request(app)
      .patch(`/api/admin/reports/${reportId}/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'resolved',
        resolutionNotes: 'Verified and resolved during automated test',
      });

    expect(resolveRes.statusCode).toBe(200);
    expect(resolveRes.body.data.status).toBe('resolved');
  });
});

function s1Id() {
  return new mongoose.Types.ObjectId();
}
