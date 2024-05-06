const requestTester = require('supertest')

const request = requestTester('http://localhost:8081')

module.exports = {
  request
}
