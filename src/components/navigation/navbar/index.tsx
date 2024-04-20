import React, { useState } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import Image from "next/image";
const Navbar = () => {

  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
		useState(false);
	const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

	const closeAll = () => {
		setIsNetworkSwitchHighlighted(false);
		setIsConnectHighlighted(false);
	};
  return (
      <header>
				<div
					className={styles.backdrop}
					style={{
						opacity:
							isConnectHighlighted || isNetworkSwitchHighlighted
								? 1
								: 0,
					}}
				/>
				<div className={styles.header}>
					<Link href="/" className="text-xl font-bold">
						<div className={styles.logo}>
							<Image
								src="/Logo-Dark.svg"
								alt="Polymer Logo"
								height="32"
								width="203"
							/>
						</div>
          </Link>


          <Link href="/points" className="text-xl font-bold">
            <p>Earn Pts</p>
          </Link>

          <Link href="/nfts" className="text-xl font-bold">
            <p>Operate NFTs</p>
          </Link>
          <Link href="/leader-board" className="text-xl font-bold">
            <p>Leaderboard</p>
          </Link>
					
					<div className={styles.buttons}>
						{/* <div
							onClick={closeAll}
							className={`${styles.highlight} ${
								isNetworkSwitchHighlighted
									? styles.highlightSelected
									: ``
							}`}
						>
							<w3m-network-button />
						</div> */}
						<div
							onClick={closeAll}
							className={`${styles.highlight} ${
								isConnectHighlighted
									? styles.highlightSelected
									: ``
							}`}
						>
							<w3m-button />
						</div>
					</div>
				</div>
			</header>
  );
};

export default Navbar;