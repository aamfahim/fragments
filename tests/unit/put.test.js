// tests/unit/put.test.js

const request = require('supertest');

let app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {

    beforeEach(() => {
        // Re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // Unauthorized access is denied
    test('unauthorized access is denied', async () => {
        const res = await request(app)
            .put('/v1/fragments/valid-fragment-id');

        expect(res.statusCode).toBe(401);
    });

    // Authenticated user can update a fragment
    test('authenticated users can update a fragment', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is an updated fragment');

        expect(putRes.statusCode).toBe(200); // check status code
    });

    // check if the data is actually updated
    test('fragment is actually updated', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const new_data = 'this is an updated fragment';
        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send(new_data);

        expect(putRes.statusCode).toBe(200); // check status code

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/text\/plain/);

        expect(getRes.text).toEqual(new_data);

    });

    // Error when trying to change the content type
    test('unable to change a fragments type', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send('# this is a fragment');

        expect(putRes.statusCode).toBe(400); // check status code
    });


    // Non-existent fragment ID returns a 404
    test('non-existent fragment ID returns a 404', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId + 1}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is an updated fragment');

        expect(putRes.statusCode).toBe(404);
    });


    // Verify response structure
    test('response structure is correct after deletion', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const expectedStructure = {
            status: expect.any(String),
            fragment: {
                id: expect.any(String),
                created: expect.any(String),
                updated: expect.any(String),
                ownerId: expect.any(String),
                type: expect.any(String),
                size: expect.any(Number),
                formats: expect.arrayContaining([expect.any(String)])
            }
        };

        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is an updated fragment');
        
        expect(putRes.statusCode).toBe(200); // post a fragment

        expect(putRes.body).toMatchObject(expectedStructure); // match object structure
    });



});
