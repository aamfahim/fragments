// tests/unit/get.json.test.js

const request = require('supertest');

let app = require('../../src/app');
describe('GET /v1/fragments', () => {

    beforeEach(() => {
        // re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // posted fragment metadata can be retrieved by id (application/json)
    test('posted fragment metadata can be retrieved by id (application/json)', async () => {
        const data = { content: 'This is a test fragment' };
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = postRes.body;

        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}/info`)
            .auth('user1@email.com', 'password1');

        const responseBody2 = getRes.body;

        expect(getRes.statusCode).toBe(200);
        expect(responseBody).toEqual(responseBody2);
    });

    // posted json fragment can be retrieved by id and ext (application/json)
    test('posted json fragment can be retrieved by id and ext (application/json)', async () => {
        const data = { content: 'This is a fragment' };
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = postRes.body;
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.json`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.body;

        expect(getRes.statusCode).toBe(200);
        expect(returned_fragment).toEqual(data);
    });

    // posted json fragment can be retrieved by id and ext(txt) (application/json)
    test('posted json fragment can be retrieved by id and ext(txt) (application/json)', async () => {
        const data = { content: 'This is a fragment' };
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = postRes.body;
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.txt`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/plain/);
        expect(returned_fragment).toEqual(JSON.stringify(data));
    });

    // returns an existing fragment data with expected Content-Type (application/json)
    test('returns an existing fragment data with expected Content-Type (application/json)', async () => {
        const data = { content: 'This is a test fragment' };
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = postRes.body;
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.headers['content-type']).toMatch(/application\/json/);
    });
 
});