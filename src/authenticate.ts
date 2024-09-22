import { Hono } from 'hono';
import { lucia } from './db/lucia';
import { db } from './db/lucia';
import { user } from './db';
import { eq } from 'drizzle-orm';
import { getCookie } from 'hono/cookie';
import { useReducer } from 'hono/jsx';


const authenticate = new Hono()

    .get('/', async (c) => {
        return c.json({ "message": "hi" });
    })

    .post('/signup', async (c) => {
        const { email, password } = await c.req.json();

        // Check if username already exists
        const existingUser = await db.select().from(user).where(eq(user.email, email)).get();
        if (existingUser) {
            c.status(400);
            return c.json({ error: 'Username already taken' });
        }

        // Create new user
        const userId = crypto.randomUUID();
        const hashedpass = await Bun.password.hash(password);
        await db.insert(user).values({
            id: userId,
            email: email,
            password: hashedpass
        });

        // Create session
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        c.header('Set-Cookie', sessionCookie.serialize());
        return c.json({ userId });
    })

    .post('/login', async (c) => {
        const { email, password } = await c.req.json();

        const userExist = await db.select().from(user).where(eq(user.email, email)).get();
        if (!userExist) {
            c.status(400);
            return c.json({ error: 'Invalid username or password' });
        }

        // In a real authenticate, you'd verify the password here
        // For simplicity, we're skipping password verification
        const isMatch = await Bun.password.verify(password, userExist.password);

        if (!isMatch) {
            c.status(400);
            return c.json({ error: 'Invalid password' });
        }

        const session = await lucia.createSession(userExist.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        c.header('Set-Cookie', sessionCookie.serialize());
        return c.json({ "usermail": userExist.email });
    })

    .post('/logout', async (c) => {
        const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

        if (!sessionId) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        await lucia.invalidateSession(sessionId);

        const sessionCookie = lucia.createBlankSessionCookie();
        c.header('Set-Cookie', sessionCookie.serialize());
        return c.json({ message: 'Logged out successfully' });
    })

    .get('/getUser', async (c) => {
        const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

        if (!sessionId) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        const loggeduser = await lucia.validateSession(sessionId);
        if (!loggeduser.session) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }


        const userExist = await db.select({ id: user.id, mail: user.email }).from(user).where(eq(user.id, loggeduser.user.id)).get();
        return c.json({ userExist });
    });

export default authenticate;
