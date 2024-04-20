import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import abi from '@/abis/points.json'
import { useConfig } from "wagmi";
import { decimal, pts_contract_address } from "@/const";

const useBalanceOfPoint = (address?: string) => {
    const [balance, setBalance] = useState(0)
    const config = useConfig()
    const fetchBalance = async () => {
        try {
            const res = await (readContract as any)(config, {
                address: pts_contract_address,
                abi,
                functionName: 'balanceOf',
                args: [address]
              })
            console.log(res, 'balance2222')
            setBalance(parseInt(res as string) / decimal)
        } catch (error) {
            
            console.log(error, 'balance2222')
        }
    }
    useEffect(() => {
        if(!address) {
            return
        }
        fetchBalance()
    }, [address])
    return {
        balance,
        fetchBalance
    }
}

export default useBalanceOfPoint