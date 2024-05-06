'use strict'
import Express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import Routes from './api/routes'
import morgan from 'morgan'
import ecsFormat from '@elastic/ecs-morgan-format'
import startServer from './startServer'
import fs from 'fs'
import path from 'path'

import { SERVER_CONFIG } from './config'
import { expressUtils } from './api/helpers'

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

const { BODY_LIMIT } = SERVER_CONFIG

const app = new Express()

app.use(morgan(ecsFormat(), {
  stream: accessLogStream
}))

app.use(cors())
app.use(bodyParser.json({ limit: BODY_LIMIT }))
app.use(bodyParser.urlencoded({ limit: BODY_LIMIT, extended: true }))
app.use(helmet())
expressUtils.middleware.init(app)
// Initialize Routes
Routes.init(app)

// Start Server
startServer(app)

// For testing
module.export = app
