import { ContractInterface } from '@ethersproject/contracts'
import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1,
} from 'constants/delegateVersions'
import { ContractJson } from 'models/contracts'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useEffect, useState } from 'react'

type JB721DelegateContractName =
  | 'JB721TieredGovernance'
  | 'IJBTiered721DelegateStore'
  | 'IJBTiered721Delegate'
  | 'IJBTiered721DelegateProjectDeployer'

export async function loadJB721DelegateJson(
  contractName: JB721DelegateContractName,
  version: JB721DelegateVersion,
): Promise<ContractJson | undefined> {
  const versionString =
    version === JB721_DELEGATE_V1
      ? 'v1'
      : version === JB721_DELEGATE_V1_1
      ? 'v1-1'
      : undefined
  if (!versionString) return
  console.info(
    'Loading JB721Delegate contract json',
    versionString,
    contractName,
  )

  // NOTE: imports are specified explicitly to avoid Webpack causing V8 to run out of memory and crash during compilation.
  if (contractName === 'JB721TieredGovernance') {
    return await import(
      `@jbx-protocol/juice-721-delegate-${versionString}/out/JB721TieredGovernance.sol/JB721TieredGovernance.json`
    )
  }

  if (contractName === 'IJBTiered721DelegateStore') {
    return await import(
      `@jbx-protocol/juice-721-delegate-${versionString}/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json`
    )
  }

  if (contractName === 'IJBTiered721Delegate') {
    return await import(
      `@jbx-protocol/juice-721-delegate-${versionString}/out/IJBTiered721Delegate.sol/IJBTiered721Delegate.json`
    )
  }

  if (contractName === 'IJBTiered721DelegateProjectDeployer') {
    return await import(
      `@jbx-protocol/juice-721-delegate-${versionString}/out/IJBTiered721DelegateProjectDeployer.sol/IJBTiered721DelegateProjectDeployer.json`
    )
  }
}

export function useJB721DelegateAbi(
  contractName: JB721DelegateContractName,
  version: JB721DelegateVersion | undefined,
) {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)

  useEffect(() => {
    if (!version) return

    loadJB721DelegateJson(contractName, version).then(json => setAbi(json?.abi))
  }, [version, contractName])

  return abi
}