import { Lucia } from 'lucia';
import { createClient } from '@libsql/client';
import { drizzle } from "drizzle-orm/libsql";
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { session, user } from '.';

export const sqliteDB = createClient({
    url: "file:main.db"
});

export const db = drizzle(sqliteDB);

const adapter = new DrizzleSQLiteAdapter(db, session, user)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === 'production'
        }
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
    }
}
