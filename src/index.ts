import { Hono } from 'hono'
import { logger } from 'hono/logger'
import authenticate from './authenticate'

const app = new Hono()
app.use("*", logger())

const apiRoute = app.basePath("/api").route("/authenticate", authenticate);

export default app
export type ApiRoute = typeof apiRoute
