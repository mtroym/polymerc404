
import { useState } from 'react';
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { base_nft_contract_address } from '@/const';
import nftAbi from '@/abis/nft.json';
import { useEffect } from 'react';
import axios from 'axios'
import { useCheckChain } from '@/hooks/index';
import {
  baseSepolia
} from "wagmi/chains";
interface IReturnType {

}
export const useGetNftList = (address?: string) => {
  // const { checkChain } = useCheckChain(baseSepolia.id)
  const [nftList, setNftList] = useState<Record<string, string>[]>([])
  const config = useConfig()

  const getTokenUri = async (tokenId: number) => {
    // try {
    //   const res = await (readContract as any)(config, {
    //       address: base_nft_contract_address,
    //       abi: nftAbi,
    //       functionName: 'tokenURI',
    //       args: [tokenId]
    //     })
    //   console.log(res, 'getTokenUri')

    // } catch (error) {  
    //   console.log(error, 'getTokenUri err')
    // }
    return (readContract as any)(config, {
      address: base_nft_contract_address,
      abi: nftAbi,
      functionName: 'tokenURI',
      args: [tokenId]
    })
  }

  const fetchUserOwnedTokenIds = async () => {
    try {
        const res = await (readContract as any)(config, {
            address: base_nft_contract_address,
            abi: nftAbi,
            functionName: 'getUserOwnedTokenIds',
            args: [address]
          })
        console.log(res, 'getUserOwnedTokenIds')
        if(res) {
          const tasks = res.map((id: string) => getTokenUri(parseInt(id)))
          Promise.all(tasks).then((urls: string[]) => {
            const nftDataTasks = urls.map(url => axios.get<Record<string, string>>(url))
            Promise.all(nftDataTasks).then((nfts: any) => {
              setNftList(nfts.map((nft: any) => ({
                ...nft.data,
              })))
            }).catch(err => {

            })
          }).catch(err => {

          })
        }
    } catch (error) {
        console.log(error, 'getUserOwnedTokenIds err')
    }
  }

  // useEffect(() => {
  //   fetchUserOwnedTokenIds()
  // }, [])

  return {
    nftList,
    fetchUserOwnedTokenIds
  }
}