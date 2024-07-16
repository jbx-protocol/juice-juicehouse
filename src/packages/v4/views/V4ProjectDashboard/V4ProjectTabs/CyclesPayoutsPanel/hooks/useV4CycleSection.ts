import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRuleset } from 'juice-sdk-react'
import { useJBQueuedRuleset } from 'packages/v4/hooks/useJBQueuedRuleset'
import { usePayoutLimits } from 'packages/v4/hooks/usePayoutLimits'
import { useQueuedPayoutLimits } from 'packages/v4/hooks/useQueuedPayoutLimits'
import { useV4FormatConfigurationCycleSection } from './useV4FormatConfigurationCycleSection'

export const useV4CycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { data: ruleset } = useJBRuleset()
  
  const { ruleset: queuedRuleset, isLoading: queuedRulesetLoading } = useJBQueuedRuleset()

  const { data: payoutLimits } = usePayoutLimits()
  const payoutLimitAmount = payoutLimits?.amount
  const payoutLimitCurrency = payoutLimits?.currency

  const { data: queuedPayoutLimits, isLoading: queuedPayoutLimitLoading } = useQueuedPayoutLimits()
  const queuedPayoutLimitAmount = queuedPayoutLimits?.amount
  const queuedPayoutLimitCurrency = queuedPayoutLimits?.currency
  
  return useV4FormatConfigurationCycleSection({
    ruleset,
    payoutLimitAmountCurrency: {
      amount: payoutLimitAmount,
      currency: payoutLimitCurrency,
    },
    queuedRulesetLoading,
    queuedPayoutLimitLoading,
    queuedRuleset,
    upcomingPayoutLimitAmountCurrency: {
      amount: queuedPayoutLimitAmount,
      currency: queuedPayoutLimitCurrency,
    },

    // Hide upcoming info from current section.
    ...(type === 'current' && {
      queuedRuleset: null,
      upcomingPayoutLimitAmountCurrency: null,
    }),
  })
}
