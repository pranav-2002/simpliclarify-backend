const { request } = require('./index')

describe('Mentor', function () {
  it('Get all mentors for a personna', async function () {
    try {
      // const mentor = await Mentor.findOne({});
      // if (!mentor) {
      //     throw new Error('Mentor not found');
      // }
      // const mentorId = mentor._id;
      const personaType = 'Job'
      const response = await request.post('/mentor/get-mentors/list')
        .send({ personaType })
        .expect('Content-Type', /json/)
        .expect(200)
      const body = response.body
      if (!(body.message === 'Fetched mentors')) {
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
