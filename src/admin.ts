import { Hono } from "hono";
import { getUser } from "./authmiddleware";
import { userInfo } from "./db/schema/userSchema";
import { db } from "./db";
import { eq } from "drizzle-orm";


export const admin = new Hono()
    .get('/me', getUser, async (c) => {
        const userId = c.var.user.id;
        const isAdmin = await db
            .select({ role: userInfo.role })
            .from(userInfo)
            .where(eq(userInfo.userId, userId));
        if (isAdmin.length > 0 && isAdmin[0].role === "admin") {
            c.status(200);
            return c.json({ "message": "Hi admin" });
        } else {
            c.status(401);
            return c.json({ "message": "You're not logged in as admin" });
        }
    });
