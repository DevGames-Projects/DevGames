import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/utils/database";
import User from "@/models/user";
const url = require('url')

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                username:  { label: "Username", type: "text" },
                type: { label: "Username", type: "text" }
            },
            async authorize(credentials, req) {
                if (credentials?.type === 'logIn'){
                    console.log(req.body.callbackUrl)
                    const res = await fetch(`https://earnest-entremet-d23403.netlify.app/api/auth/logIn`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });
                    const user = await res.json();
                    console.log(user)
                    if (res.status === 200) {
                        return user;
                    } else {
                        throw new Error( JSON.stringify({ errors: user, status: false }))
                    }
                }else if (credentials?.type === 'signIn'){
                    const res = await fetch(`https://dev-games-brown.vercel.app/api/auth/signIn`, {
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
                    });
                    const user = await res.json();
                    if (res.status === 200) {
                        return user;
                    } else {
                        throw new Error( JSON.stringify({ errors: user, status: false }))
                    }
                }

                return false
            },
        }), 
    ],
    callbacks: {
        async session({session, user}){
            const sessionUser = await User.findOne({email: session.user.email})

            session.user.id = sessionUser._id.toString()
            session.user.name = sessionUser.username
            session.user.level = sessionUser.level

            console.log('check')
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET
})

export {handler as GET, handler as POST}