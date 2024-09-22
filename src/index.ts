import { Hono } from 'hono'
import { logger } from 'hono/logger'
import authenticate from './authenticate'
import { testroute } from './testroute'

const app = new Hono()
app.use("*", logger())

const apiRoute = app.basePath("/api").route("/authenticate", authenticate).route('/testroute', testroute);

export default app
export type ApiRoute = typeof apiRoute
