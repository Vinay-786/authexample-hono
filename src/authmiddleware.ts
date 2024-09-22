import { getCookie } from "hono/cookie";
import { lucia } from "./db/lucia";
import { createMiddleware } from "hono/factory";
import { user } from "./db";
import { db } from "./db/lucia";
import { eq } from "drizzle-orm";
import { SelectUser } from "./db";
import { InsertUser } from "./db";

type Env = {
    Variables: {
        user: InsertUser
    }
}


export const getUser = createMiddleware<Env>(async (c, next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

    if (!sessionId) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }

    try {
        const loggeduser = await lucia.validateSession(sessionId);
        if (!loggeduser.session) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }
        const userExist = await findUser(db, loggeduser.user.id);
        if (userExist) {
            c.set("user", userExist)
            await next();
        }

    } catch (e) {
        console.error(e);
        return c.json({ error: "Unauthorized" }, 401);

    }
});


export async function findUser(
    database: typeof db,
    loggeduserid: string,
): Promise<SelectUser | null> {
    const result = await database
        .select()
        .from(user)
        .where(eq(user.id, loggeduserid));
    if (!result || result.length === 0) {
        return null;
    }

    return result[0];
}

