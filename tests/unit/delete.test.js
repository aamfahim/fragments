// tests/unit/delete.test.js

const request = require('supertest');

let app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {

    beforeEach(() => {
        // Re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // Unauthorized access is denied
    test('unauthorized access is denied', async () => {
        const res = await request(app)
            .delete('/v1/fragments/valid-fragment-id');

        expect(res.statusCode).toBe(401);
    });

    // Authenticated user can delete a fragment
    test('authenticated users can delete a fragment', async () => {
        const postRes = await request(app)
            .post('/v1/fragments/')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send('this is a fragment');

        expect(postRes.statusCode).toBe(201); // post a fragment
        const fragmentId = postRes.body.fragment.id; // get id from response

        const delRes = await request(app)
            .delete(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(delRes.statusCode).toBe(200); // check status code
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

        const delRes = await request(app)
            .delete(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');        

        expect(delRes.body).toMatchObject({ status: 'ok' }); // match object structure
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

        const delRes = await request(app)
            .delete(`/v1/fragments/${fragmentId+1}`)
            .auth('user1@email.com', 'password1');

        expect(delRes.statusCode).toBe(404);
    });


});
