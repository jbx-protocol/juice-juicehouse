import { Contract } from 'ethers'
import { JBControllerVersion } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectController'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { createContext } from 'react'

export interface V2V3ProjectContracts {
  JBController?: Contract
  JBETHPaymentTerminal?: Contract
  JBETHPaymentTerminalStore?: Contract
  JBFundAccessConstraintsStore?: Contract
}

export const V2V3ProjectContractsContext: React.Context<{
  contracts: V2V3ProjectContracts
  loading: {
    cvsLoading?: boolean
    projectContractsLoading?: {
      JBControllerLoading: boolean
      JBETHPaymentTerminalLoading: boolean
      JBETHPaymentTerminalStoreLoading: boolean
      JBFundAccessConstraintsStoreLoading: boolean
    }
  }
  versions: {
    JBControllerVersion?: JBControllerVersion
    JBETHPaymentTerminalVersion?: V2V3ContractName
  }
}> = createContext({
  contracts: {},
  loading: {},
  versions: {},
})
