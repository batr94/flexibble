import { getServerSession } from 'next-auth/next';
import { NextAuthOptions, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { SessionInterface, UserProfile } from '@/common.types';
import { createUser, getUser } from './actions';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    jwt: {
        encode: ({ secret, token}) => {
            const encodedToken = jsonwebtoken.sign({
                ...token,
                iss: 'batr',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            }, secret);

            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;

            return decodedToken;
        }
    },
    theme: {
        colorScheme: 'light',
        logo: '/logo.png',
    },
    callbacks: {
        async session({ session }) {
            const email = session?.user?.email as string;

            try {
                const { user } = await getUser(email) as { user?: UserProfile };

                return {
                    ...session,
                    user: {
                        ...session.user,
                        ...user,
                    }
                };
            } catch (error) {
                console.log('Error retrieving user data', error);
                return session;
            }

        },
        async signIn({ user }: { user: AdapterUser | User }) {
            try {
                const userExists = await getUser(user?.email as string) as { user?: UserProfile}

                if (!userExists.user) {
                    await createUser(
                        user?.name as string,
                        user?.email as string,
                        user?.image as string,
                    )
                }
                return true;
            } catch(error: any) {
                console.log(error);

                return false;
            }
        }
    },
};

export async function getCurrentUser() {
    return await getServerSession(authOptions) as SessionInterface;
}