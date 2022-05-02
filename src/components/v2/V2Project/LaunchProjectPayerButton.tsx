import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useState } from 'react'

import LaunchProjectPayerModal from './LaunchProjectPayerModal'

export default function LaunchProjectPayerButton({
  useDeployProjectPayerTx,
  size,
  text,
  onCompleted,
  disabled,
  tooltipText,
}: {
  useDeployProjectPayerTx: () => TransactorInstance<{}> | undefined
  size?: SizeType
  text?: JSX.Element
  onCompleted?: VoidFunction
  disabled?: boolean
  tooltipText?: JSX.Element
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  function DeployButton() {
    return (
      <Tooltip title={!disabled && tooltipText}>
        <Button
          onClick={() => setModalVisible(true)}
          size={size ?? 'small'}
          type="default"
          disabled={disabled}
        >
          <span>{text ?? <Trans>Deploy project payer contract</Trans>}</span>
        </Button>
      </Tooltip>
    )
  }
  return (
    <>
      <DeployButton />
      <LaunchProjectPayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
        onConfirmed={onCompleted}
      />
    </>
  )
}
