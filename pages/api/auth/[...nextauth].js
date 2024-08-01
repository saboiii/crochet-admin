import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"

let adminEmails = ['saba.x.azad@gmail.com'];

export const authOptions = {
    adapter: MongoDBAdapter(client),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    callbacks: {
        session: ({ session, token, user }) => {
            if (adminEmails.includes(session?.user?.email)) {
                return session;
            } else {
                return false;
            }
        },
    },
}
export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(401);
        res.end();
        console.log(adminEmails);
        throw 'You are not an admin.';
    }
}