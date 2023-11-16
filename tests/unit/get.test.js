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
});