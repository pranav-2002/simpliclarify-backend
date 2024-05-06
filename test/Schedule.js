// import requestTester from 'supertest';
// import Mentor from "../api/schemas/_Mentor.js";

// import app from '../app.js';
// const app = require('../app.js');
// import '../server';
const { request } = require('./index')

describe('Schedule', function () {
  it('Get the schedule for a mentor', async function () {
    try {
      // const mentor = await Mentor.findOne({});
      // if (!mentor) {
      //     throw new Error('Mentor not found');
      // }
      // const mentorId = mentor._id;
      const mentorId = '60f47a596102ac001a063b6d'
      const response = await request.post('/schedule/get-schedule')
        .send({ mentorId })
        .expect('Content-Type', /json/)
        .expect(200)
      const body = response.body
      if (!(body.message === 'Successfully got the schedule for mentor')) {
        throw new Error('Body message does not match')
      }

      const requiredElements = ['data']
      for (let i = 0; i < requiredElements.length; i++) {
        if (!(requiredElements[i] in body)) {
          throw new Error(`Body element ${requiredElements[i]} is missing`)
        }
      }
    } catch (err) {
      throw err
    }
  })
})
