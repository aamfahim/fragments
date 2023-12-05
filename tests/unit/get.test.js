// tests/unit/get.test.js

const request = require('supertest');

let app = require('../../src/app');

describe('GET /v1/fragments', () => {


    beforeEach(() => {
        // re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
        request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

    // If the response header has location attribute defined
    test('response headers have location defined', async () => {
        const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
        expect(res.headers.location).toBeDefined();
    });

    // If the response header has location attribute set
    test('response headers have location set', async () => {
        const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
        expect(res.headers.location).toContain('/v1/fragments');
    });

    // Using a valid username/password pair should give a success result with a .fragments array
    test('authenticated users get a fragments array', async () => {
        const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(Array.isArray(res.body.fragments)).toBe(true);
    });

    // status code is 415 when unsupported type is requested    
    test('error with unsupported type ', async () => {

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is a test fragment');

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text
        const fragmentId = responseBody.fragment.id; // adjust as necessary to match your response structure

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.md`)
            .auth('user1@email.com', 'password1');
        expect(getRes.statusCode).toBe(415);

    });

    // Non-existent data retrival with fragment ID returns a 404
    test('non-existent fragment ID returns a 404', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId+1}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(404);
    });

    // Non-existent meta data retrival with fragment ID returns a 404
    test('non-existent fragment ID returns a 404', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId+1}/info`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(404);
    });
});