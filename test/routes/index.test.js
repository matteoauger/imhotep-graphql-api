const request = require('supertest');
const assert = require('assert');
const app = require('../../app');

describe('App', function() {
  it('Base route works', async function() {
    const res = await request(app)
      .get('/');

    assert.equal(res.statusCode, 200);
  });
}); 
