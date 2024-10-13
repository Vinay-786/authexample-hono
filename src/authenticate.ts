import { Hono } from 'hono';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { getCookie } from 'hono/cookie';
import { getUser } from './authmiddleware';
import { userTable } from './db/userSchema';
import { createSession, deleteSessionTokenCookie, generateSessionToken, invalidateSession, SessionValidationResult, setSessionTokenCookie, validateSessionToken } from './db/sessionApi';


const authenticate = new Hono()
    .post('/signup', async (c) => {
        const { email, password } = await c.req.json();

        // Check if username already exists
        const existingUser = await db.select().from(userTable).where(eq(userTable.email, email)).get();
        if (existingUser) {
            c.status(400);
            return c.json({ error: 'Email already registered' });
        }

        // Create new user
        const userId = crypto.randomUUID();
        const hashedpass = await Bun.password.hash(password);
        await db.insert(userTable).values({
            id: userId,
            email: email,
            hashedpass: hashedpass
        });

        // Create session
        const token = generateSessionToken();
        const session = await createSession(token, userId)

        setSessionTokenCookie(c, token, session.expiresAt)
        return c.json({ userId });
    })

    .post('/login', async (c) => {
        const { email, password } = await c.req.json();

        const userExist = await db.select().from(userTable).where(eq(userTable.email, email)).get();
        if (!userExist) {
            c.status(400);
            return c.json({ error: 'Invalid username or password' });
        }

        // In a real authenticate, you'd verify the password here
        // For simplicity, we're skipping password verification
        const isMatch = await Bun.password.verify(password, userExist.hashedpass);

        if (!isMatch) {
            c.status(400);
            return c.json({ error: 'Invalid password' });
        }

        const token = getCookie(c, "mysession")
        if (!token || token == undefined) {
            const newToken = generateSessionToken();
            const session = await createSession(newToken, userExist.id)
            setSessionTokenCookie(c, newToken, session.expiresAt)
            return c.json({ "usermail": userExist.email });
        }
        const { session, user }: SessionValidationResult = await validateSessionToken(token)
        setSessionTokenCookie(c, token, session!.expiresAt)
        return c.json({ "usermail": user!.email });
    })

    .post('/logout', async (c) => {
        const sessionId = getCookie(c, "mysession") ?? null;

        if (!sessionId) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        await invalidateSession(sessionId);

        deleteSessionTokenCookie(c);
        return c.json({ message: 'Logged out successfully' });
    })

    .get('/me', getUser, async (c) => {
        const user = c.var.user;
        return c.json({ "user": user.email })
    });

export default authenticate;
