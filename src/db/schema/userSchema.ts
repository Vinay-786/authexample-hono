import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, relations } from 'drizzle-orm';

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    hashedpass: text("hashpasses").notNull()
});

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at", {
        mode: "timestamp"
    }).notNull()
});


export const userInfo = sqliteTable("userInfo", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    address: text("address"),
    phoneNo: text("phoneNo"),
    role: text("role", { enum: ["admin", "customer"] }),
});

export const profileInfoRelation = relations(userInfo, ({ one }) => ({
    user: one(userTable, { fields: [userInfo.id], references: [userTable.id] })
}));

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
