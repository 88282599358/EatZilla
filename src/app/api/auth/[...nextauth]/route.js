import clientPromise from "@/lib/mongoConnect";
import { UserInfo } from "@/models/UserInfo";
import bcrypt from "bcryptjs";
import * as mongoose from "mongoose";
import { User } from '@/models/User';
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"

export const authOptions = {
    secret: process.env.SECRET,
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                username: { label: "Email", type: "email", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const email = credentials?.email;
                    const password = credentials?.password;

                    mongoose.connect(process.env.MONGO_URL);
                    const user = await User.findOne({ email });
                    const passwordOk = await bcrypt.compare(password, user.password);

                    if (passwordOk) {
                        return user;
                    }
                } catch (error) {
                    throw new Error(error);
                }
            }
        })
    ],
    session: {
        // Use JWT strategy for session management // Set it as jwt instead of database
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (user) {
                token.accessToken = user.access_token;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.accessToken = token.accessToken;
            session.user.id = token.id;

            return session;
        },
    },
}

export async function isAdmin() {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
        return false;
    }
    const userInfo = await UserInfo.findOne({ email: userEmail });
    if (!userInfo) {
        return false;
    }
    return userInfo.admin;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }