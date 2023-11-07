// tests/unit/post.test.js

const request = require('supertest');

let app = require('../../src/app');
const contentType = require('content-type');

describe('POST /v1/fragments', () => {

    beforeEach(() => {
        // re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // unauthenticated users are denied
    test('unauthenticated requests are denied', () =>
        request(app).post('/v1/fragments').expect(401));


    // authenticated user can post a plain text fragment
    test('authenticated users can create a plain text fragment', async () => {
        const res = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(res.statusCode).toBe(201);
    });

    // response headers match the posted fragment type
    test('response headers have correct content type', async () => {
        const res = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        const parsedContentType = contentType.parse(res.headers['content-type']);
        expect(parsedContentType.type).toBe('application/json');
    });

    // response headers have location attribute defined in the header
    test('response headers have location attribute defined', async () => {
        const res = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(res.headers.location).toBeDefined();
    });


    // response headers have location attribute set
    test('response headers have location set', async () => {
        const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
        expect(res.headers.location).toContain('/v1/fragments');
    });


    // the response includes the fragment posted
    test('responses include all necessary and expected properties', async () => {
        const text_frag = 'This is another test fragment';
        const res = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send(text_frag)

        const responseBody = JSON.parse(res.text); // Manually parse the response text

        expect(responseBody).toMatchObject({
            status: 'ok',
            id: expect.any(String),
            ownerId: expect.any(String),
            created: expect.any(String),
            updated: expect.any(String),
            type: 'text/plain'
        });
        expect(responseBody.size).toBe(Buffer.byteLength('This is another test fragment'));
    });

    // unsupported type of fragment creation fails
    test('trying to create a fragment with an unsupported type errors as expected', async () => {
        const res = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/xml')
            .send('This is another test fragment');
        expect(res.statusCode).toBe(415); // assuming 415 is returned for unsupported media type
        expect(res.body.status).toBe('error'); // adjust this based on your actual error response structure
    });

});
