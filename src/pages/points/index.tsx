import { useEffect } from 'react';
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import FunMint from "@/components/FunMint";
import Layout from "@/components/Layout";

export default function Home() {

	return (
		<>
			<Head>
				<title>WalletConnect | Next Starter Template</title>
				<meta
					name="description"
					content="Generated by create-wc-dapp"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
				<link href="./output.css" rel="stylesheet"></link>
			</Head>
			<Layout>
				<main className={styles.main}>
					<div className={styles.wrapper}>
						<div className={styles.container}>
							<FunMint />
						</div>
					</div>
				</main>
			</Layout>
		</>
	);
}