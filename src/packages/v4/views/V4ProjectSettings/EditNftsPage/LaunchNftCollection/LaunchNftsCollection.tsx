import { AddNftCollectionForm } from 'components/NftRewards/AddNftCollectionForm/AddNftCollectionForm'
import { Button } from 'antd'
import { NATIVE_TOKEN_SYMBOLS } from 'juice-sdk-core'
import { SUPPORTED_JB_MULTITERMINAL_ADDRESS } from 'packages/v4/hooks/useLaunchProjectTx'
import { Trans } from '@lingui/macro'
import TransactionModal from 'components/modals/TransactionModal'
import { TransactionSuccessModal } from '../../EditCyclePage/TransactionSuccessModal'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useJBChainId } from 'juice-sdk-react'
import { useLaunchNftsForm } from './hooks/useLaunchNftsForm'

// v4TODO: this whole component needs to be v4-ified
export function LaunchNftsPage() {
  const {
    form,
    launchCollection,
    launchButtonLoading,
    launchTxPending,
    successModalOpen,
    setSuccessModalOpen,
  } = useLaunchNftsForm()

  const postPayModalData = useAppSelector(
    state => state.creatingV2Project.nftRewards.postPayModal,
  )
  const nftRewardsData = useAppSelector(
    state => state.creatingV2Project.nftRewards,
  )
  const chainId = useJBChainId()
  const chainIdStr =
    chainId?.toString() as keyof typeof SUPPORTED_JB_MULTITERMINAL_ADDRESS

  return (
    <>
      <AddNftCollectionForm
        form={form}
        priceCurrencySymbol={NATIVE_TOKEN_SYMBOLS[chainIdStr]}
        postPayModalData={postPayModalData}
        nftRewardsData={nftRewardsData}
        okButton={
          <Button
            type="primary"
            onClick={launchCollection}
            loading={launchButtonLoading}
            className="mt-10"
          >
            <Trans>Deploy NFT collection</Trans>
          </Button>
        }
      />
      <TransactionModal transactionPending open={launchTxPending} />
      <TransactionSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your new NFTs have been deployed</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                New NFTs will be available in your next cycle as long as it
                starts after your edit deadline.
              </Trans>
            </div>
          </>
        }
      />
    </>
  )
}
