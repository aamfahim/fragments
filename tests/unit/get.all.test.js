// tests/unit/get.all.test.js

const request = require('supertest');

let app = require('../../src/app');
describe('GET /v1/fragments', () => {
    
    beforeEach(() => {
        // re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });
    
    
    // authenticated users can post and get fragments
    test('authenticated users can post and get fragment', async () => {

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is a test fragment');

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // adjust as necessary to match your response structure

        const getRes = await request(app)
            .get('/v1/fragments')
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.status).toBe('ok');
        expect(Array.isArray(getRes.body.fragments)).toBe(true);
        expect(getRes.body.fragments).toContain(fragmentId);
    });

    // retrieved fragment includes the added fragment ids
    test('fragments array includes all the fragments', async () => {
        const postRes1 = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is the first test fragment');

        const responseBody1 = JSON.parse(postRes1.text);
        const postId1 = responseBody1.fragment.id;

        const postRes2 = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is the second test fragment');

        const responseBody2 = JSON.parse(postRes2.text);

        const postId2 = responseBody2.fragment.id;

        const getRes = await request(app)
            .get('/v1/fragments')
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.status).toBe('ok');
        expect(Array.isArray(getRes.body.fragments)).toBe(true);
        expect(getRes.body.fragments.length).toBe(2); // assert the length of the array
        expect(getRes.body.fragments).toEqual(expect.arrayContaining([postId1, postId2]));
    });

    // retrieved array includes entire fragment object when expand is true  
    test('retrieve expanded fragment details with expand=1 parameter', async () => {

        const postRes1 = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is the first test fragment');

        const responseBody1 = JSON.parse(postRes1.text).fragment;

        const postRes2 = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is the second test fragment');

        const responseBody2 = JSON.parse(postRes2.text).fragment;

        // GET the list of fragments with expand=1
        const getRes = await request(app)
            .get('/v1/fragments?expand=1')
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.status).toBe('ok');
        expect(Array.isArray(getRes.body.fragments)).toBe(true);

        // Assert that the fragments array only contains the fragments added
        expect(getRes.body.fragments.length).toBe(2); // assert the length of the array
        expect(getRes.body.fragments).toEqual(expect.arrayContaining([
            expect.objectContaining(responseBody1),
            expect.objectContaining(responseBody2)
        ])); // assert that each added fragment is in the array
    });
});