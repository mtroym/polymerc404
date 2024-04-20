import { Button, TabList, Tab, useNotification } from '@web3uikit/core';
import useCurrentChain from '@/hooks/useCurrentChain';
import styles from './index.module.scss'
import Layout from "@/components/Layout";
import Link from 'next/link';
import Image from 'next/image';
import { WriteContractReturnType } from 'viem';
import { pts_contract_address, nft_contract_address, NftMintList, base_nft_contract_address } from "@/const";

import abi from '@/abis/points.json'

import { useAccount, useWriteContract, useConfig } from 'wagmi';
import NftCardForSale from '@/components/NftCardForSale';
import nftAbi from '@/abis/nft.json'
import { useState } from 'react';
import { readContract } from '@wagmi/core';
import { useGetNftList } from '@/hooks';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useCheckChain } from '@/hooks/index';
import {
	optimismSepolia,
  baseSepolia
} from "wagmi/chains";


export default function NFT() {
  const account = useAccount()
  const dispatch = useNotification();
  const currentChain = useCurrentChain()
  const config = useConfig()
  const [tabKey, setTabKey] = useState(1)
  const { nftList, fetchUserOwnedTokenIds } = useGetNftList(account.address)

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()
  const { checkChain: checkBaseChain } = useCheckChain(baseSepolia.id)
  const { checkChain: checkOpChain } = useCheckChain(optimismSepolia.id)


  useEffect(() => {
    checkOpChain()
  }, [])

  useEffect(() => {
    if(tabKey === 1) {
      checkOpChain()
      return
    } else {
      checkBaseChain()
    }
  }, [tabKey])

  useEffect(() => {
    if(tabKey === 1) {
       checkOpChain()
       return
    }
    if(tabKey !== 2) {
      return
    }
    if(currentChain && currentChain.id === baseSepolia.id) {
      fetchUserOwnedTokenIds()
    }
  }, [currentChain, tabKey])

  const randomMintNft = async () => {
    const flag = await checkAllowance()
    if(!flag) {
      return 
    }
    const res = await (writeContract as any)({
      address: nft_contract_address,
      abi: nftAbi,
      functionName: 'crossChainRandomMint',
      args: [base_nft_contract_address, '0x6368616e6e656c2d313000000000000000000000000000000000000000000000', 3600]
    },
    {
      onSuccess: (data: WriteContractReturnType) => {
        dispatch({
          type: 'info',
          message: "crossChainRandomMint in progress",
          title: 'New Notification',
          position: 'topR',
        })
        console.log(data, 'crossChainRandomMint')
      },
      onError: (err: WriteContractReturnType) => {
        console.log(err, 'crossChainRandomMint failed')
      },
    })
    console.log(res, 'crossChainRandomMint res')
  }

  const mintNft = async (nftId: string) => {
    const flag = await checkAllowance()
    if(!flag) {
      return 
    }
    const funcName = `mint${nftId}`
    const res = await (writeContract as any)({
      address: nft_contract_address,
      abi: nftAbi,
      functionName: 'crossChainMint',
      args: [base_nft_contract_address, '0x6368616e6e656c2d313000000000000000000000000000000000000000000000', 3600, nftId, false]
    },
    {
      onSuccess: (data: WriteContractReturnType) => {
        dispatch({
          type: 'info',
          message: funcName + "minting in progress",
          title: 'New Notification',
          position: 'topR',
        })
        console.log(data, funcName)
      },
      onError: (err: WriteContractReturnType) => {
        console.log(err, funcName,'mintNft1 failed')
      },
    })
    console.log(res, 'mintNft1 res')
  }

  const approve = async () => {
    const approveAmount = '999999999999999999999999999'
    const res = await (writeContract as any)({
      address: pts_contract_address,
      abi,
      functionName: 'approve',
      args: [nft_contract_address, approveAmount]
    },
    {
      onSuccess: (data: WriteContractReturnType, variables: any, context: any) => {
        console.log(data, 'approve success')
      },
      onError: (err: WriteContractReturnType) => {
        console.log(err, 'approve failed')
      },
    })

    console.log('approve res', res)
  }

  const checkAllowance = async () => {
    const res = await (readContract as any)(config, {
      address: pts_contract_address,
      abi,
      functionName: 'allowance',
      args: [account.address, nft_contract_address]
    })
    const allowance = parseInt(res)
    console.log('allowance>>>', res)
    // 
    if(allowance === 0) {
        dispatch({
          type: 'warning',
          message: "you need approve points first",
          title: 'New Notification',
          position: 'topR',
        })
      const res = await approve()
      return res
    }
    return res
  }

  return (
  <Layout>
    <div className={styles.nftContainer}>
      <div className={styles.topInfo}>
        <div className={styles.info}>
          <h1 className={styles.title}>Purchase a Mystery NFT which could be any one of the Polymer Phase 2 NFT Types</h1>
          <div className={styles.action}>
            <Link href="/points" className="text-xl font-bold">
              <Button text="Explore" type="button" theme="moneyPrimary" size="large"/>
            </Link>
            <Button onClick={randomMintNft} text="Purchase random NFT" type="button" theme="outline" size="large"/>
          </div>
        </div>
        <Image src="/images/nftDemo.jpg" alt='' width={330} height={330}/>
      </div>
      <div className={styles.nftTabs}>
        <h2 className={styles.buyNftTitle}>Polymer Phase 2 NFTS</h2>
        <TabList
          defaultActiveKey={tabKey}
          onChange={setTabKey}
          tabStyle="bulbUnion"
        >
          <Tab
            tabKey={1}
            tabName="Mint"
          >
          </Tab>
          <Tab
            tabKey={2}
            tabName="My Nft"
          >
          </Tab>
        </TabList>
      </div>
      <div className={classNames(styles.nftList, {
        [styles.hidden]: tabKey === 2
      })}>
        {NftMintList.map(nft => (
          <NftCardForSale 
            className={styles.nftItem} 
            handleNftMint={() => mintNft(nft.id)}
            name={nft.name}
            btnText2="Buy"
            // url={nft.url}
          />
        ))} 
      </div>
      <div className={classNames(styles.nftList, {
        [styles.hidden]: tabKey === 1
      })}>
        {nftList.map(nft => (
          <NftCardForSale
            btnText2='Cast'
            url={nft.image}
            className={styles.nftItem} 
            // handleNftMint={() => mintNft(nft.id)}
            name={nft.name}
            showBurn={true}
          />
        ))} 
      </div>
    </div>
  </Layout>)
}