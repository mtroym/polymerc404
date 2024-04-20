import { useMemo } from 'react'
import { useChainId, useChains } from 'wagmi'

const useCurrentChain = () => {
  const chainId = useChainId()
  const chains = useChains()
  const currentChain = useMemo(() => {
    return chains.find(chain => chain.id === chainId)
  }, [chainId])

  return currentChain
}

export default useCurrentChain