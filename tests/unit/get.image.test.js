// tests/unit/get.image.test.js

const request = require('supertest');
const path = require('node:path'); 
const fs = require('fs');

let app = require('../../src/app');
describe('GET /v1/fragments', () => {

    beforeEach(() => {
        // re-import module to get a fresh state:
        jest.resetModules();
        app = require('../../src/app');
    });

    // posted image fragment data can be retrieved by id (image/png)
    test('posted fragment can be retrieved by id', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // adjust as necessary to match your response structure

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/image\/png/);
    });

    // posted image fragment metadata can be retrieved by id(image/png)
    test('posted fragment metadata can be retrieved by id', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

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



    // posted image fragment can be retrieved by id and ext (image/png)
    test('posted fragment can be retrieved by id and ext', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.png`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/image\/png/);
    });


    // posted image fragment can be retrieved by id and ext (image/jpeg)
    test('posted fragment can be retrieved by id and ext', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.jpg`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/image\/jpg/);
    });
    
    // posted image fragment can be retrieved by id and ext (image/webp)
    test('posted fragment can be retrieved by id and ext', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.webp`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/image\/webp/);
    });


    // posted image fragment can be retrieved by id and ext (image/gif)
    test('posted fragment can be retrieved by id and ext', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const getRes = await request(app)
            .get(`/v1/fragments/${fragmentId}.gif`)
            .auth('user1@email.com', 'password1');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.headers['content-type']).toMatch(/image\/gif/);
    });

    // wrong conversion gives 400
    test('posted fragment type cannot be changed', async () => {
        const filePath = path.resolve(__dirname, './images/joke.png');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const filePath2 = path.resolve(__dirname, './images/eyes.gif');
        const data2 = fs.readFileSync(filePath2);
        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/gif')
            .send(data2);

        expect(putRes.statusCode).toBe(400);
    });
    
    // posted image fragment can be updated
    test('posted fragment type cannot be changed', async () => {
        const filePath = path.resolve(__dirname, './images/flower.webp');
        const data = fs.readFileSync(filePath);

        const postRes = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/webp')
            .send(data);

        expect(postRes.statusCode).toBe(201);
        const responseBody = JSON.parse(postRes.text); // Manually parse the response text

        const fragmentId = responseBody.fragment.id; // Extracting id from the nested fragment object

        const filePath2 = path.resolve(__dirname, './images/nyan_cat.webp');
        const data2 = fs.readFileSync(filePath2);
        const putRes = await request(app)
            .put(`/v1/fragments/${fragmentId}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/webp')
            .send(data2);

        expect(putRes.statusCode).toBe(200);

    });
    

});