import { Hono } from "hono";


export const testroute = new Hono()
    .get('/', (c) => {
        return c.json({ "message": "testroute" })
    });
