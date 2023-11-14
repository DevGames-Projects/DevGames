import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/utils/database";
import User from "@/models/user";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                // ... (votre configuration de credentials)
            },
            async authorize(credentials, req) {
                const promises = [];

                if (credentials?.type === 'logIn') {
                    console.log(req.body.callbackUrl);
                    promises.push(fetch(`https://earnest-entremet-d23403.netlify.app/api/auth/logIn`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    }));
                } else if (credentials?.type === 'signIn') {
                    promises.push(fetch(`https://dev-games-brown.vercel.app/api/auth/signIn`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            username: credentials?.username,
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    }));
                }

                const responses = await Promise.all(promises);

                const users = await Promise.all(responses.map(async (res) => {
                    const user = await res.json();
                    if (res.status === 200) {
                        return user;
                    } else {
                        throw new Error(JSON.stringify({ errors: user, status: false }));
                    }
                }));


                return users[0]; // Retournez le premier utilisateur (ou ajustez en fonction de vos besoins)
            },
        }),
    ],
    callbacks: {
        async session({ session }) {
            await connectToDb()
            const sessionEmail = session?.user.email
            const sessionUser = await User.findOne({email : sessionEmail})
            console.log(sessionUser);

            session.user.id = sessionUser._id.toString();
            session.user.name = sessionUser.username;
            session.user.level = sessionUser.level;

            console.log('check');
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
