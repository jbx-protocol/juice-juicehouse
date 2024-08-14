import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { NATIVE_TOKEN_DECIMALS } from 'juice-sdk-core'
import { TxStatus } from 'models/transaction'
import { useProjectPageQueries } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
import {
  useProjectDispatch,
  useProjectSelector,
} from 'packages/v2v3/components/V2V3Project/ProjectDashboard/redux/hooks'
import { projectCartActions } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/redux/projectCartSlice'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import { formatCurrencyAmount } from 'packages/v2v3/utils/formatCurrencyAmount'
import { useCallback, useContext, useMemo, useReducer } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { formatEther, parseUnits } from 'viem'
import * as Yup from 'yup'
import { payProjectModalReducer } from './payProjectModalReducer'
import { usePayProjectTx } from './usePayProjectTx'

const ValidationSchema = Yup.object().shape({
  message: Yup.object().shape({
    messageString: Yup.string().max(256, 'Message is too long'),
    attachedUrl: Yup.string().url('Invalid URL'),
  }),
  userAcceptsTerms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions',
  ),
  beneficiaryAddress: Yup.string(),
})

const getValidationSchema = (projectHasPayNotice: boolean) =>
  projectHasPayNotice
    ? ValidationSchema.shape({
        userAcceptsNotice: Yup.boolean().oneOf(
          [true],
          "You must understand and accept this project's notice.",
        ),
      })
    : ValidationSchema

export type PayProjectModalFormValues = Yup.InferType<typeof ValidationSchema>

export const usePayProjectModal = () => {
  const { payModalOpen, payAmount, chosenNftRewards } = useProjectSelector(
    state => state.projectCart,
  )
  const dispatch = useProjectDispatch()
  const { projectMetadata } = useProjectMetadataContext()
  const { name, payDisclosure } = projectMetadata ?? {}
  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()
  const [modalState, modalDispatch] = useReducer(payProjectModalReducer, {
    isTransactionPending: false,
    isTransactionConfirmed: false,
    transactionError: undefined,
  })
  const { setProjectPayReceipt } = useProjectPageQueries()
  const { transactions } = useContext(TxHistoryContext)

  const open = payModalOpen
  const setOpen = useCallback(
    (open: boolean) => {
      dispatch(projectCartActions.setPayModal({ open }))
    },
    [dispatch],
  )

  const onPaySubmit = usePayProjectTx({
    onTransactionPending: () => {
      modalDispatch({ type: 'transactionPending' })
    },
    onTransactionConfirmed: (payReceipt, formikHelpers) => {
      setProjectPayReceipt(payReceipt)
      setOpen(false)
      dispatch(projectCartActions.payProject())
      setTimeout(() => {
        formikHelpers.setSubmitting(false)
        formikHelpers.resetForm()
        modalDispatch({ type: 'reset' })
      }, 300)
    },
    onTransactionError: (error: Error, formikHelpers) => {
      emitErrorNotification(error.message)
      modalDispatch({ type: 'reset' })
      formikHelpers.setSubmitting(false)
    },
  })

  const primaryAmount = !payAmount
    ? formatCurrencyAmount({ amount: 0, currency: V2V3_CURRENCY_ETH })
    : formatCurrencyAmount(payAmount)

  const secondaryAmount = useMemo(() => {
    if (!payAmount || Number.isNaN(payAmount.amount)) {
      return undefined
    }

    if (payAmount.currency === V2V3_CURRENCY_ETH) {
      const amount = Number(
        converter.weiToUsd(
          parseUnits(payAmount.amount.toString(), NATIVE_TOKEN_DECIMALS),
        ),
      )
      return formatCurrencyAmount({
        amount,
        currency: V2V3_CURRENCY_USD,
      })
    }

    return formatCurrencyAmount({
      amount: formatEther(converter.usdToWei(payAmount.amount).toBigInt()),
      currency: V2V3_CURRENCY_ETH,
    })
  }, [converter, payAmount])

  const pendingTransactionHash = transactions?.find(
    tx => tx.status === TxStatus.pending,
  )?.tx?.hash

  const validationSchema = getValidationSchema(!!payDisclosure)

  return {
    open,
    primaryAmount,
    secondaryAmount,
    userAddress,
    nftRewards: chosenNftRewards,
    validationSchema,
    projectName: name,
    projectPayDisclosure: payDisclosure,
    pendingTransactionHash,
    ...modalState,
    setOpen,
    onPaySubmit,
  }
}