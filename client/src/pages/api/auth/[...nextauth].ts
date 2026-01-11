import Credentials from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
    callbacks: {
        // https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd
        async session({ session, token }) {
            const excludeKeys = ['iat', 'exp', 'jti', 'apiToken'];
  
            // Reduces the token to an object excluding the specified keys.
            const sanitizedToken = Object.entries(token).reduce((acc: any, [key, value]) => {
              if (!excludeKeys.includes(key)) {
                acc[key] = value; // Includes the property if not excluded.
              }
              return acc;
            }, {});

            return { ...session, user: sanitizedToken, apiToken: token.apiToken };
        },
        async jwt ({ token, user, account, profile }) {
            if (typeof user !== "undefined") {
              // user has just signed in so the user object is populated
              return user as unknown as JWT
            }
            return token
          }
    },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.BACKEND_URL}/api/users/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });
                const resJson = await res.json();

                // If no error and we have user data, return it
                if (res.ok && resJson) {
                    console.log(resJson);
                    return { ...resJson.user, apiToken: resJson.token }
                }
                // Return null if user data could not be retrieved
                console.log("auth failed");
                return null;
            }
        })
    ],
};

export default NextAuth(authOptions);