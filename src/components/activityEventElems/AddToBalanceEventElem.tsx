import { t } from '@lingui/macro'
import RichNote from 'components/RichNote/RichNote'
import ETHAmount from 'components/currency/ETHAmount'
import { ProjectEventsQuery } from 'generated/graphql'
import { toBigNumber } from 'utils/bigNumbers'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function AddToBalanceEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['addToBalanceEvent']
  withProjectLink?: boolean
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      header={t`Transferred ETH to project`}
      subject={
        <span className="font-heading text-lg font-medium">
          <ETHAmount amount={toBigNumber(event.amount)} />
        </span>
      }
      extra={
        <RichNote
          note={event.note ?? ''}
          className="text-grey-900 dark:text-slate-100"
        />
      }
    />
  )
}
