// tests/unit/get.text.test.js

const request = require('supertest');

let app = require('../../src/app');
describe('GET /v1/fragments', () => {

    beforeEach(() => {
        // re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // posted text fragment data can be retrieved by id (text/plain)
    test('posted fragment can be retrieved by id', async () => {

        const data = 'This is a fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // adjust as necessary to match your response structure

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/plain/);
        expect(Number(getRes.headers['content-length'])).toBe(data.length);

        expect(getRes.text).toEqual(data);
    });


    // posted fragment metadata can be retrieved by id(text/plain)
    test('posted fragment metadata can be retrieved by id', async () => {

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is a test fragment');

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}/info`)
            .auth('user1@email.com', 'password1');
        const responseBody2 = JSON.parse(postRes.text).fragment; // Extracting the fragment object

        expect(getRes.statusCode).toBe(200);

        expect(responseBody.fragment).toEqual(responseBody2);
    });

    // posted text fragment can be retrieved by id and ext (text/plain)
    test('posted text fragment can be retrieved by id and ext', async () => {

        const data = 'This is a fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text
        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.txt`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);

        expect(returned_fragment).toEqual(data);
    });

    // returns an existing fragment data with expected Content-Type (text/plain)
    test('returns an existing fragment data with expected Content-Type', async () => {

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('This is a test fragment');

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text
        const fragmentId = responseBody.fragment.id; // adjust as necessary to match your response structure

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.headers['content-type']).toMatch(/text\/plain/);
    });


    // posted fragment metadata can be retrieved by id (text/html)
    test('posted fragment metadata can be retrieved by id (text/html)', async () => {
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send('<p>This is a test fragment</p>');

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);

        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}/info`)
            .auth('user1@email.com', 'password1');
        const responseBody2 = JSON.parse(getRes.text);

        expect(getRes.statusCode).toBe(200);
        expect(responseBody).toEqual(responseBody2);
    });

    // posted text fragment can be retrieved by id and ext (text/html)
    test('posted text fragment can be retrieved by id and ext (text/html)', async () => {
        const data = '<p>This is a fragment</p>';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.html`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);
        expect(returned_fragment).toEqual(data);
    });

    // posted text fragment can be retrieved by id and ext(txt) (text/html)
    test('posted text fragment can be retrieved by id and ext(txt) (text/html)', async () => {
        const data = '<p>This is a fragment</p>';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.txt`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/plain/);
        expect(returned_fragment).toEqual(data);
    });

    // returns an existing fragment data with expected Content-Type (text/html)
    test('returns an existing fragment data with expected Content-Type (text/html)', async () => {
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send('<p>This is a test fragment</p>');

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.headers['content-type']).toMatch(/text\/html/);
    });



    // posted fragment metadata can be retrieved by id (text/markdown)
    test('posted fragment metadata can be retrieved by id (text/markdown)', async () => {
        const data = '# This is a Markdown fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);

        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}/info`)
            .auth('user1@email.com', 'password1');
        const responseBody2 = JSON.parse(getRes.text);

        expect(getRes.statusCode).toBe(200);
        expect(responseBody).toEqual(responseBody2);
    });

    // posted text fragment can be retrieved by id and ext (txt) (text/markdown)
    test('posted text fragment can be retrieved by id and ext (txt) (text/markdown)', async () => {
        const data = '# This is a Markdown fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.txt`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/plain/);
        expect(returned_fragment).toEqual(data);
    });

    // posted text fragment can be retrieved by id and ext(md) (text/markdown)
    test('posted text fragment can be retrieved by id and ext(md) (text/markdown)', async () => {
        const data = '# This is a Markdown fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.md`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/markdown/);
        expect(returned_fragment).toEqual(data);
    });

    // posted text fragment can be retrieved by id and ext(html) (text/markdown)
    test('posted text fragment can be retrieved by id and ext(html) (text/markdown)', async () => {
        const data = '# This is a Markdown fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.html`)
            .auth('user1@email.com', 'password1');

        const returned_fragment = getRes.text;

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/html/);
        expect(returned_fragment).toEqual(expect.stringContaining('<h1>This is a Markdown fragment</h1>'));
    });

    // returns an existing fragment data with expected Content-Type (text/markdown)
    test('returns an existing fragment data with expected Content-Type (text/markdown)', async () => {
        const data = '# This is a Markdown fragment';
        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text);
        const fragmentId = responseBody.fragment.id;

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.headers['content-type']).toMatch(/text\/markdown/);
    });
});