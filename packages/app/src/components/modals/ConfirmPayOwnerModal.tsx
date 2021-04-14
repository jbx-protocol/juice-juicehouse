import { BigNumber } from '@ethersproject/bignumber'
import { Input, Descriptions, Form, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { useContext } from 'react'
import { formatWad, parsePerMille } from 'utils/formatCurrency'
import { weightedRate } from 'utils/math'

export default function ConfirmPayOwnerModal({
  projectId,
  project,
  budget,
  visible,
  usdAmount,
  onSuccess,
  onCancel,
}: {
  projectId: BigNumber
  project: ProjectIdentifier
  budget: Budget | null | undefined
  visible?: boolean
  usdAmount: number | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const [form] = useForm<{ note: string }>()
  const { contracts, transactor, userAddress, weth } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const weiAmount = converter.usdToWei(usdAmount)

  async function pay() {
    if (!contracts || !projectId || !transactor) return

    await form.validateFields()

    transactor(
      contracts.Juicer,
      'pay',
      [
        projectId.toHexString(),
        weiAmount?.toHexString(),
        userAddress,
        form.getFieldValue('note') || '',
      ],
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  const receivedTickets = weightedRate(
    budget,
    weiAmount,
    parsePerMille('100').sub(budget?.reserved ?? '0'),
  )

  const ownerTickets = weightedRate(budget, weiAmount, budget?.reserved)

  return (
    <Modal
      title={'Pay ' + project?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      width={800}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Pay amount">
            {usdAmount} USD ({formatWad(weiAmount)} {weth?.symbol})
          </Descriptions.Item>
          <Descriptions.Item label="Tickets for you">
            {formatWad(receivedTickets)}
          </Descriptions.Item>
          <Descriptions.Item label="Tickets for owner">
            {formatWad(ownerTickets)}
          </Descriptions.Item>
        </Descriptions>
        <Form form={form}>
          <Form.Item label="Memo" name="note" rules={[{ max: 256 }]}>
            <Input.TextArea
              placeholder="Add a note to this payment on-chain (optional)."
              maxLength={256}
              showCount
              autoSize
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
