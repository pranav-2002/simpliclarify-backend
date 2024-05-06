'use strict'
import { SERVER_CONFIG, MONGO_CONFIG } from './config'
// import { logger } from './api/helpers'

const { PORT } = SERVER_CONFIG

const startServer = async (app) => {
  try {
    // connect to mongodb
    await MONGO_CONFIG.mongoConnect()
    console.log('[Info] MongoDB Connected')
    await app.listen(PORT)
    console.log(`[Info] Server Started Successfully ${process.env.PORT}`)
  } catch (error) {
    process.exit(1)
  }
}

export default startServer
