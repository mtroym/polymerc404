
import NextAuth from 'next-auth'
// import type { SIWESession } from '@web3modal/siwe'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import type { NextApiRequest, NextApiResponse } from "next"


// declare module 'next-auth' {
//   interface Session extends SIWESession {
//     address: string
//     chainId: number
//   }
// }
const nextAuthSecret = process.env.NEXTAUTH_SECRET
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set')
}
// Get your projectId on https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
}

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  secret: nextAuthSecret,
  providers: [
    CredentialsProvider ({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0'
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0'
        }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.message) {
            throw new Error('SiweMessage is undefined')
          }
          // const nextAuthUrl = new URL("")
          const siwe = new SiweMessage(credentials.message)
          const nonce = await getCsrfToken({ req })
          const result = await siwe.verify({
            signature: credentials?.signature || '',
            // domain: nextAuthUrl.host,
            nonce
          })
          if (result.success) {
            return {
              id: `eip155:${siwe.chainId}:${siwe.address}`
            }
          }

          return null
        } catch (e) {
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    session({ session, token }: {session: any, token: any}) {
      console.log('session', session)
      if (!token.sub) {
        return session
      }

      const [, chainId, address] = token.sub.split(':')
      if (chainId && address) {
        session.address = address
        session.chainId = parseInt(chainId, 10)
      }

      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions)
}
// import type { NextApiRequest, NextApiResponse } from "next"
// import NextAuth from "next-auth"

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   return await handler(req, res, authOptions)
// }