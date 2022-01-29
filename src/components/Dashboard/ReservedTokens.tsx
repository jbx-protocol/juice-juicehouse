import { Button } from 'antd'
import { t, Trans } from '@lingui/macro'
import TooltipLabel from 'components/shared/TooltipLabel'

import { ProjectContext } from 'contexts/projectContext'
import useReservedTokensOfProject from 'hooks/contractReader/ReservedTokensOfProject'
import { FundingCycle } from 'models/funding-cycle'
import { TicketMod } from 'models/mods'
import { NetworkName } from 'models/network-name'
import { useContext, useState } from 'react'
import { formatWad, fromPerbicent } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import { readNetwork } from 'constants/networks'

import DistributeTokensModal from '../modals/DistributeTokensModal'
import TicketModsList from '../shared/TicketModsList'
import { PROJECT_IDS } from 'constants/projectIds'

export default function ReservedTokens({
  fundingCycle,
  ticketMods,
  hideActions,
}: {
  fundingCycle: FundingCycle | undefined
  ticketMods: TicketMod[] | undefined
  hideActions?: boolean
}) {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>()

  const { projectId, tokenSymbol, isPreviewMode } = useContext(ProjectContext)

  const metadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  const reservedTokens = useReservedTokensOfProject(metadata?.reservedRate)

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId?.eq(PROJECT_IDS.CONSTITUTION_DAO)

  const isSharkDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId?.eq(PROJECT_IDS.SHARK_DAO)

  return (
    <div>
      <div>
        <TooltipLabel
          label={
            <h4 style={{ display: 'inline-block' }}>
              <Trans>Reserved</Trans> {tokenSymbol ?? t`tokens`}(
              {fromPerbicent(metadata?.reservedRate)}%)
            </h4>
          }
          tip={t`A project can reserve a percentage of tokens minted from every payment it receives. They can be distributed to the receivers below at any time.`}
        />
      </div>

      {metadata?.reservedRate ? (
        <TicketModsList
          mods={ticketMods}
          fundingCycle={fundingCycle}
          projectId={projectId}
        />
      ) : null}

      {!hideActions && !isConstitutionDAO && !isSharkDAO && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: 20,
          }}
        >
          <span>
            {formatWad(reservedTokens, { precision: 0 }) || 0}{' '}
            {tokenSymbol ?? t`tokens`}
          </span>
          <Button
            style={{ marginLeft: 10 }}
            size="small"
            onClick={() => setModalIsVisible(true)}
            disabled={isPreviewMode}
          >
            <Trans>Distribute</Trans>
          </Button>

          <DistributeTokensModal
            visible={modalIsVisible}
            onCancel={() => setModalIsVisible(false)}
            onConfirmed={() => setModalIsVisible(false)}
          />
        </div>
      )}
    </div>
  )
}
