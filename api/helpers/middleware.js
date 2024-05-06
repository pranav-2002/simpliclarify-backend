'use strict'
const middleware = {
  projection
}
export default middleware
// parse keys values to number.
async function projection (request, response, next) {
  const { query: uQuery } = request
  const kArr = Object.keys(uQuery); const len = kArr.length
  for (let i = 0; i < len; i++) {
    const k = kArr[i]
    const v = uQuery[k]
    if (v === '1') {
      uQuery[k] = 1
    } else if (v === '0') {
      uQuery[k] = 0
    }
  }
  request.query = uQuery
  next()
}
