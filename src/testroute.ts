import { Hono } from "hono";
import { getUser } from './authmiddleware';


export const testroute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;

        return c.json({ "Your email is": user.email })
    });
