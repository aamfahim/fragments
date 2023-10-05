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

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // If the response header has location attribute defined
  test('check response headers for location', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.headers.location).toBeDefined();
  });

  test('if posted fragment can be retrieved and matches', async () => {

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a test fragment');

    expect(postRes.statusCode).toBe(201);
    const responseBody = JSON.parse(postRes.text); // Manually parse the response text

    const fragmentId = responseBody.id; // adjust as necessary to match your response structure

    const getRes = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(Array.isArray(getRes.body.fragments)).toBe(true);
    expect(getRes.body.fragments).toContain(fragmentId);
  });


  test('fragments array includes all the fragments', async () => {
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is the first test fragment');

    const responseBody1 = JSON.parse(postRes1.text);
    const postId1 = responseBody1.id;

    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is the second test fragment');

    const responseBody2 = JSON.parse(postRes2.text);

    const postId2 = responseBody2.id;

    const getRes = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(Array.isArray(getRes.body.fragments)).toBe(true);
    expect(getRes.body.fragments).toEqual(expect.arrayContaining([postId1, postId2]));
  });

  test('retrieve expanded fragment details with expand=1 parameter', async () => {

    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is the first test fragment');

    const responseBody1 = JSON.parse(postRes1.text);
    delete responseBody1.status


    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is the second test fragment');

    const responseBody2 = JSON.parse(postRes2.text);
    delete responseBody2.status

    // GET the list of fragments with expand=1
    const getRes = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(Array.isArray(getRes.body.fragments)).toBe(true);
    expect(getRes.body.fragments).toEqual(
      expect.arrayContaining([
        expect.objectContaining(responseBody1),
        expect.objectContaining(responseBody2)
      ])
    );
  });


  test('if posted fragment can be retrieved by id ', async () => {

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a test fragment');

    expect(postRes.statusCode).toBe(201);
    const responseBody = JSON.parse(postRes.text); // Manually parse the response text
    delete responseBody.status;

    const fragmentId = responseBody.id; // adjust as necessary to match your response structure

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    const responseBody2 = JSON.parse(getRes.text); // Manually parse the response text
    delete responseBody2.status
    console.log(responseBody2);

    expect(getRes.statusCode).toBe(200);

    expect(responseBody).toEqual(responseBody2);
  });

  test('if posted fragment can be retrieved by id and ext ', async () => {

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a test fragment');

    expect(postRes.statusCode).toBe(201);
    const responseBody = JSON.parse(postRes.text); // Manually parse the response text
    delete responseBody.status;

    const fragmentId = responseBody.id; // adjust as necessary to match your response structure

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .auth('user1@email.com', 'password1');
    const responseBody2 = JSON.parse(getRes.text); // Manually parse the response text
    delete responseBody2.status
    console.log(responseBody2);

    expect(getRes.statusCode).toBe(200);

    expect(responseBody).toEqual(responseBody2);
  });

  test('error with unsupported type ', async () => {

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a test fragment');

    expect(postRes.statusCode).toBe(201);
    const responseBody = JSON.parse(postRes.text); // Manually parse the response text
    delete responseBody.status;

    const fragmentId = responseBody.id; // adjust as necessary to match your response structure

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.md`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);

  });
});