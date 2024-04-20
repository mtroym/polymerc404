import "@/styles/globals.css";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider, http, createConfig } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
	mainnet,
	baseSepolia,
	optimismSepolia,
	base,
	optimism
} from "wagmi/chains";
import { SiweMessage } from 'siwe'
import { createSIWEConfig } from '@web3modal/siwe'
import type { SIWECreateMessageArgs, SIWESession, SIWEVerifyMessageArgs } from '@web3modal/siwe'
import { getCsrfToken, signIn, signOut, getSession, SessionProvider } from 'next-auth/react'
import { Session } from "next-auth"

import { createClient } from 'viem'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationProvider } from '@web3uikit/core';

const siweConfig = createSIWEConfig({
	createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
		new SiweMessage({
			version: '1',
			domain: window.location.host,
			uri: window.location.origin,
			address,
			chainId,
			nonce,
			// Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
			statement: 'Sign in With Ethereum.'
		}).prepareMessage(),
	getNonce: async () => {
		const nonce = await getCsrfToken()
		if (!nonce) {
			throw new Error('Failed to get nonce!')
		}
		return nonce
	},
	getSession: async () => {
		const session = await getSession()
		if (!session) {
			throw new Error('Failed to get session!')
		}

		const { address, chainId } = session as unknown as SIWESession
		return { address, chainId }	
	},
	verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
		try {
			const success = await signIn('credentials', {
				message,
				redirect: false,
				signature,
				callbackUrl: '/protected'
			})

			return Boolean(success?.ok)
		} catch (error) {
			return false
		}
	},
	signOut: async () => {
		try {
			await signOut({
				redirect: false
			})

			return true
		} catch (error) {
			return false
		}
	}
})
// optimismSepolia.rpcUrls = {
// 	...optimismSepolia.rpcUrls,
// }
const chains = [
	mainnet,
	base,
	optimism,
	baseSepolia,
	optimismSepolia
];

// 1. Get projectID at https://cloud.walletconnect.com

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
	name: "Next Starter Template",
	description: "A Next.js starter template with Web3Modal v3 + Wagmi",
	url: "https://web3modal.com",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
export const wagmiConfig = createConfig({
  chains,
  // transports: {
  //   [mainnet.id]: http(),
  //   [baseSepolia.id]: http(),
  //   [optimismSepolia.id]: http(),
  // },
	client({ chain }) {
    const res = createClient({ chain, transport: http() })
		return res
	}
})

const queryClient = new QueryClient() 


// const wagmiConfig = defaultWagmiConfig({ 
// 	projectId: projectId, 
// 	chains: chains,
// 	metadata: metadata,
// 	enableCoinbase: false,
// 	enableEmail: false,
// 	enableWalletConnect: false,
// });



createWeb3Modal({
	// siweConfig: siweConfig,
	wagmiConfig: wagmiConfig,
	projectId,
	// chains: [
	// 	baseSepolia,
	// 	optimismSepolia
	// ]
});

export default function App({ Component, pageProps }: AppProps<{session: Session}>) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);
	return (
		<>
			{ready ? (
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={queryClient}> 
						<SessionProvider session={pageProps.session}>
    						<NotificationProvider>
								<Component {...pageProps} />
							</NotificationProvider>
						</SessionProvider>
					</QueryClientProvider>
				</WagmiProvider>

			) : null}
		</>
	);
}
