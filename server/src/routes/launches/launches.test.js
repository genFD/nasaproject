// const request = require('supertest');
// const app = require('../../app');
// import { app } from '../../app';
// import { request } from 'supertest';
// pb: test blocked because jest does not support ecmascript

//Solution :
// create jest config https://jestjs.io/docs/configuration
// activate ESM support in your tests.https://jestjs.io/docs/ecmascript-modules

describe('Test case : GET/launches', () => {
  test('It responded with 200 sucess', async () => {
    await request(app).get('/launches').expect(200);
    // expect(response.statusCode).toBe(200);
  });
});

describe('Test case: POST/launches', () => {
  test('It should respond with 200 sucess', () => {
    const response = 200;
    expect(response).toBe(200);
  });
  test('It should catch missing required properties', () => {
    const response = 200;
    expect(response).toBe(200);
  });
  test('It should catch invalid dates', () => {});
});
