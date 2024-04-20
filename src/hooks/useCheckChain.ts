
import { useCurrentChain } from '@/hooks/index';
import { useEffect } from 'react';
import { useSwitchChain, useConnect  } from 'wagmi'
import { injected } from 'wagmi/connectors'


const useCheckChain = (targetChainId: number) => {
  const chain = useCurrentChain()
	const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
	const checkChain = () => {
		if(!chain) {
			//Todo connect
      connect({ connector: injected() })
		}
		if(chain?.id !== targetChainId) {
			switchChain({
				chainId: targetChainId
			})
		}
		return true
	}
	// useEffect(() => {
	// 	checkChain()
	// }, [chain])

	return {
		checkChain
	}
}

export default useCheckChain