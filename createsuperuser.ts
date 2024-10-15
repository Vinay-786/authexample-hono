import { db } from './src/db/index';
import { userInfo, userTable } from './src/db/schema/userSchema';


const createAdmin = async () => {
    const hash = await Bun.password.hash("admin101")
    const userId = crypto.randomUUID();
    const res = await db
        .insert(userTable)
        .values({
            id: userId,
            email: "itsvinay.in@outlook.com",
            hashedpass: hash
        })
    const resProfile = await db.insert(userInfo)
        .values({
            id: crypto.randomUUID(),
            userId: userId,
            role: "admin"
        })

    if (res && resProfile) {
        console.log("admim created")
    }
}

createAdmin()
