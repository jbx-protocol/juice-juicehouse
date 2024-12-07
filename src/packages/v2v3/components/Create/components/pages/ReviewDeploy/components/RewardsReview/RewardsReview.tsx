import { useCallback, useMemo } from 'react'

import { NftRewardTier } from 'models/nftRewards'
import { ReviewDescription } from '../ReviewDescription'
import { RewardsList } from 'components/NftRewards/RewardsList/RewardsList'
import { V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import { creatingV2ProjectActions } from 'redux/slices/creatingV2Project'
import { formatEnabled } from 'utils/format/formatBoolean'
import { t } from '@lingui/macro'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { v4 } from 'uuid'

export const RewardsReview = () => {
  const { nftRewards: nftRewardsData, fundingCycleMetadata } = useAppSelector(
    state => state.creatingV2Project,
  )

  const dispatch = useAppDispatch()

  const rewards: NftRewardTier[] = useMemo(() => {
    return (
      nftRewardsData.rewardTiers?.map(t => ({
        id: parseInt(v4()),
        name: t.name,
        contributionFloor: t.contributionFloor,
        description: t.description,
        maxSupply: t.maxSupply,
        remainingSupply: t.maxSupply,
        externalLink: t.externalLink,
        fileUrl: t.fileUrl,
        beneficiary: t.beneficiary,
        reservedRate: t.reservedRate,
        votingWeight: t.votingWeight,
      })) ?? []
    )
  }, [nftRewardsData.rewardTiers])

  const setRewards = useCallback(
    (rewards: NftRewardTier[]) => {
      dispatch(
        creatingV2ProjectActions.setNftRewardTiers(
          rewards.map(reward => ({
            contributionFloor: reward.contributionFloor,
            maxSupply: reward.maxSupply,
            remainingSupply: reward.maxSupply,
            id: reward.id,
            fileUrl: reward.fileUrl,
            name: reward.name,
            externalLink: reward.externalLink,
            description: reward.description,
            beneficiary: reward.beneficiary,
            reservedRate: reward.reservedRate,
            votingWeight: reward.votingWeight,
          })),
        ),
      )
    },
    [dispatch],
  )

  const shouldUseDataSourceForRedeem = useMemo(() => {
    return formatEnabled(fundingCycleMetadata.useDataSourceForRedeem)
  }, [fundingCycleMetadata.useDataSourceForRedeem])

  const preventOverspending = useMemo(() => {
    return formatEnabled(nftRewardsData.flags.preventOverspending)
  }, [nftRewardsData.flags.preventOverspending])

  const nftCurrency = nftRewardsData?.pricing.currency

  return (
    <div className="flex flex-col gap-12">
      <RewardsList
        priceCurrencySymbol={nftCurrency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'}
        nftRewardsData={nftRewardsData}
        value={rewards}
        onChange={setRewards}
      />
      <div className="flex flex-col gap-12 md:flex-row">
        <ReviewDescription
          title={t`Use NFTs for redemptions`}
          desc={
            <div className="text-base font-medium">
              {shouldUseDataSourceForRedeem}
            </div>
          }
        />
        <ReviewDescription
          title={t`Prevent NFT overspending`}
          desc={
            <div className="text-base font-medium">{preventOverspending}</div>
          }
        />
      </div>
    </div>
  )
}
