import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps, Space } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useLatestBlockNumber } from 'hooks/LatestBlockNumber'
import { useContext, useEffect, useState } from 'react'
import {
  downloadAdditionsToBalance,
  downloadParticipants,
  downloadPayments,
  downloadRedemptions,
  downloadV2V3Payouts,
} from 'utils/csvDownloadHelpers'

export default function V2V3DownloadActivityModal(props: ModalProps) {
  const [blockNumber, setBlockNumber] = useState<number>()

  const latestBlockNumber = useLatestBlockNumber({ behind: 5 })

  useEffect(() => {
    setBlockNumber(latestBlockNumber)
  }, [latestBlockNumber])

  const { projectId, pv } = useContext(ProjectMetadataContext)

  return (
    <Modal
      cancelText={t`Close`}
      okButtonProps={{ hidden: true }}
      centered
      title={<Trans>Download project activity CSV</Trans>}
      {...props}
    >
      <label className="mb-1 block">
        <Trans>Block number</Trans>
      </label>
      <FormattedNumberInput
        value={blockNumber?.toString()}
        onChange={val => setBlockNumber(val ? parseInt(val) : undefined)}
        accessory={
          <InputAccessoryButton
            content={t`Latest`}
            onClick={() => setBlockNumber(latestBlockNumber)}
            disabled={blockNumber === latestBlockNumber}
          />
        }
        className="mb-4"
      />

      <Space direction="vertical" className="w-full">
        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadParticipants(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Participants</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadV2V3Payouts(blockNumber, projectId)}
        >
          <span>
            <Trans>Payouts</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadPayments(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Payments</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadRedemptions(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Redemptions</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadAdditionsToBalance(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Additions to balance</Trans>
          </span>
        </Button>
      </Space>
    </Modal>
  )
}
