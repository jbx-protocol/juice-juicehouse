import { Table } from 'antd'
import { BackToProjectButton } from 'components/buttons/BackToProjectButton'
import EtherscanLink from 'components/EtherscanLink'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'
import { V2V3ProjectHeaderActions } from '../V2V3ProjectHeaderActions'

/**
 * Contracts that we don't want to show in the list.
 */
const CONTRACT_EXCLUSIONS = [
  V2V3ContractName.JBController,
  V2V3ContractName.JBETHPaymentTerminal,
  V2V3ContractName.JBETHPaymentTerminal3_1,
  V2V3ContractName.JBController3_0_1,
  V2V3ContractName.JBController3_1,
  V2V3ContractName.DeprecatedJBDirectory,
  V2V3ContractName.DeprecatedJBSplitsStore,
  V2V3ContractName.JBVeNftDeployer,
  V2V3ContractName.JBVeTokenUriResolver,
  V2V3ContractName.JBTiered721DelegateProjectDeployer,
]

export function V2V3ProjectContractsDashboard() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { handle } = useContext(V2V3ProjectContext)
  const { contracts: projectContracts } = useContext(
    V2V3ProjectContractsContext,
  )

  if (!contracts) return null

  const columns = [
    {
      title: 'Contract name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <EtherscanLink type="address" value={address} />
      ),
    },
  ]

  const dataSource = [
    ...Object.keys(projectContracts)
      .map((k, idx) => {
        return {
          key: `${idx}`,
          name:
            k === V2V3ContractName.JBETHPaymentTerminal
              ? 'Primary Terminal'
              : k,
          address: contracts[k as V2V3ContractName]?.address,
        }
      })
      .filter(c => c.address !== undefined),
    ...Object.keys(contracts)
      .map((k, idx) => {
        return {
          key: `${idx}`,
          name: k,
          address: contracts[k as V2V3ContractName]?.address,
        }
      })
      .filter(
        c =>
          c.address !== undefined &&
          !CONTRACT_EXCLUSIONS.includes(c.name as V2V3ContractName),
      ),
  ]

  return (
    <div className="my-0 mx-auto flex max-w-5xl flex-col gap-y-5 px-5 pb-5">
      <ProjectHeader
        actions={<V2V3ProjectHeaderActions />}
        handle={handle}
        projectOwnerAddress={undefined}
        canEditProjectHandle={false}
      />
      <div className="mb-5">
        <BackToProjectButton
          projectPageUrl={v2v3ProjectRoute({ projectId, handle })}
        />
      </div>
      <h2 className="text-grey-900 dark:text-slate-100">Project contracts</h2>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  )
}
