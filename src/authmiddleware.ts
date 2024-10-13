import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { userTable, type User } from "./db/userSchema";
import { validateSessionToken } from "./db/sessionApi";

type Env = {
    Variables: {
        user: User
    }
}


export const getUser = createMiddleware<Env>(async (c, next) => {
    const sessionId = getCookie(c, 'mysession') ?? null;

    if (!sessionId) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }

    try {
        const loggeduser = await validateSessionToken(sessionId);
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


async function findUser(
    database: typeof db,
    loggeduserid: string,
): Promise<User | null> {
    const result = await database
        .select()
        .from(userTable)
        .where(eq(userTable.id, loggeduserid));
    if (!result || result.length === 0) {
        return null;
    }

    return result[0];
}

