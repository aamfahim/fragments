const request = require('supertest');
const app = require('../../src/app');

describe('Check 404 route', () => {
    test('should return http 404 response', async () => {
        const res = await request(app).get('/jack');
        expect(res.statusCode).toBe(404);
    });

    test('should return status error', async () => {
        const res = await request(app).get('/jack');
        expect(res.body.status).toBe("error");
    });

    test('should return error code 404', async () => {
        const res = await request(app).get('/jack');
        expect(res.body.error.code).toBe(404);
    })
})