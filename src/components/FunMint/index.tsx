"use client";

import React, { useEffect, useRef, useState } from "react";
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent, useConfig, useAccount } from 'wagmi'
import { watchContractEvent, readContract } from '@wagmi/core'

// import { WriteContractVariables } from "wagmi/query";
import { LuckyWheel } from '@lucky-canvas/react'
import { Button, LinkTo, useNotification } from '@web3uikit/core';
import abi from '@/abis/points.json'
import { WriteContractReturnType } from "viem";
import { pts_contract_address as contract_address, nft_contract_address, pointList } from "@/const";
import styles from './index.module.scss'
import { useBalanceOfPoint, useCheckChain } from "@/hooks/index";
import {
	optimismSepolia,
} from "wagmi/chains";

export function UserInfo() {
  const myLucky = useRef()
  const account = useAccount()
  const dispatch = useNotification();
  const { balance, fetchBalance } = useBalanceOfPoint(account.address)
  const { checkChain } = useCheckChain(optimismSepolia.id)
	
	useEffect(() => {
		checkChain()
	}, [])
  useCheckChain(optimismSepolia.id)
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()
  const config = useConfig()

  useEffect(() => {
    const unwatch = (watchContractEvent as any)(config, {
      address: contract_address,
      abi: [{
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "PointsAdded",
        "type": "event"
      }],
      eventName: 'PointsAdded',
      onLogs(logs:any) {
        console.log('New logs!', logs)
        if(logs.length) {
          const { args } = logs[0]
          const res = parseInt(args?.amount)
          startWheel(res)
          fetchBalance()
        }
        unwatch()
      },
    })
    return () => {
      unwatch()
    }
  }, [])

  const startWheel = (point: number) => {
    setTimeout(() => {
      const index = pointList.findIndex(item => item.id === point)
      myLucky?.current?.stop(index)
    }, 2500)
  }

  const approve = async () => {
    const approveAmount = '999999999999999999999999999'
    const res = await (writeContract as any)({
      address: contract_address,
      abi,
      functionName: 'approve',
      args: [nft_contract_address, approveAmount]
    },
    {
      onSuccess: (data: WriteContractReturnType, variables: any, context: any) => {
        // dispatch({
        //   type: 'info',
        //   message: "minting in progress",
        //   title: 'New Notification',
        //   position: 'topR',
        // })
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
      address: contract_address,
      abi,
      functionName: 'allowance',
      args: [account.address, nft_contract_address]
    })
    const allowance = parseInt(res)
    console.log('allowance>>>', res)
    // 
    if(allowance === 0) {
      return await approve()
    }
    return res
  }

  const canMint = async () => {
    const res = await (readContract as any)(config, {
      address: contract_address,
      abi,
      functionName: '_canFunMint',
      args: [account.address]
    })
    return res
  }

  const startMint = async () => {
    const flag = await canMint();
    console.log(flag, 'can mint?')
    if(!flag) {
      dispatch({
        type: 'error',
        message: "You can only fun mint once every 10min",
        title: 'New Notification',
        position: 'topR',
      })
      return
    }
    (writeContract as any)(
      {
        address: contract_address,
        abi: [
          {
            "inputs": [],
            "name": "funMint",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
        ],
        functionName: 'funMint',
        args: [],
      },
      {
        onSuccess: (data: WriteContractReturnType, variables: any, context: any) => {
          myLucky?.current?.play();
          dispatch({
            type: 'info',
            message: "minting in progress",
            title: 'New Notification',
            position: 'topR',
          })
          console.log(data, variables, context)
        },
        onError: (err: WriteContractReturnType) => {
          console.log(err)
        },
      }
    )
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [prizes] = useState(pointList)
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%', background: '#869cfa',
      pointer: true,
      fonts: [{ text: 'Start', top: '-10px' }]
    }
  ])
  const [blocks] = useState([
    { padding: '6px', background: '#869cfa' }
  ])

  return (
    <div className={styles.funMint}>
        <p>current points: {balance}</p>
        <LuckyWheel width="300px" height="300px"
          ref={myLucky} 
          blocks={blocks}
          prizes={prizes}
          buttons={buttons}
          onEnd={(prize: any)  => { // 抽奖结束会触发end回调
            dispatch({
              type: 'info',
              message: '恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品',
              title: 'New Notification',
              position: 'topR',
            })
          }}
          // onStart={startMint}
        />
        <div className={styles.actions}>
          <Button
            disabled={isPending}
            type="button"
            theme="primary"
            onClick={startMint}
            text={isPending ? 'Confirming...' : 'Spin the Wheel'}
            style={{ background: 'rgb(86, 185, 202)', marginRight: '8px', borderWidth: '0px'}}
            size="large"
          />
          <LinkTo
            address="https://www.youtube.com"
            // icon={<SvgYoutube fill="#0B72C4" fontSize={18}/>}
            iconLayout="none"
            // onClick={function noRefCheck(){}}
            text="Learn More"
            type="external"
          />

        </div>

        {/* {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed. data: {hash}</div>}
        {error && (
          <div>Error: {(error as BaseError).details || error.stack}</div>
        )} */}
        {/* <Button
          disabled={isPending}
          type="button"
          theme="primary"
          onClick={mintNft}
          text={isPending ? 'Confirming...' : 'nft Mint'}
        />
        <Button
          disabled={isPending}
          type="button"
          theme="primary"
          onClick={randomMintNft}
          text={isPending ? 'Confirming...' : 'random nft Mint'}
        /> */}
    </div>
  )
}

export default UserInfo;