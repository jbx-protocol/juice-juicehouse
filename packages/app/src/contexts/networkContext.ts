import { Web3Provider } from '@ethersproject/providers'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import { NetworkName } from 'models/network-name'
import { createContext } from 'react'

export const NetworkContext: React.Context<{
  signingProvider?: Web3Provider
  signerNetwork?: NetworkName
  usingBurnerProvider?: boolean
  wallet?: Wallet,  
  onNeedProvider?: () => Promise<void>
  // TODO(odd-amphora): Fold into one.
  onSelectWallet?: () => void,
  onLogOut?: () => void,
}> = createContext({})
