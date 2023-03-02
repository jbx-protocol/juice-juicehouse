import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { Space } from 'antd'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'

import { isZeroAddress } from 'utils/address'
import { DataSourceListItems } from './DataSourceListItems'
import { FundingCycleDetailsRow } from './FundingCycleDetailsRow'
import { FundingCycleListItems } from './FundingCycleListItems'
import { RulesListItems } from './RulesListItems'
import { TokenListItems } from './TokenListItems'

export default function FundingCycleDetails({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
  showDiffs,
  mintRateZeroAsUnchanged,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  showDiffs?: boolean
  mintRateZeroAsUnchanged?: boolean
}) {
  return (
    <Space className="w-full" direction="vertical" size="middle">
      <FundingCycleDetailsRow
        header={t`Cycle`}
        items={
          <FundingCycleListItems
            fundingCycle={fundingCycle}
            distributionLimit={distributionLimit}
            distributionLimitCurrency={distributionLimitCurrency}
            showDiffs={showDiffs}
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Project token`}
        items={
          <TokenListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
            showDiffs={showDiffs}
            mintRateZeroAsUnchanged={mintRateZeroAsUnchanged}
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Other rules`}
        items={
          <RulesListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
            showDiffs={showDiffs}
          />
        }
      />
      {!isZeroAddress(fundingCycleMetadata.dataSource) ? (
        <FundingCycleDetailsRow
          header={t`Data source`}
          items={
            <DataSourceListItems fundingCycleMetadata={fundingCycleMetadata} />
          }
        />
      ) : null}
    </Space>
  )
}
