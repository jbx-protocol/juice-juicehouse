import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { useWallet } from 'hooks/Wallet'
import { FormItemInput } from 'models/formItemInput'
import { MouseEventHandler } from 'react'
import { helpPagePath } from 'utils/routes'

export const CustomStrategyInput: React.FC<
  FormItemInput<string> & { onClick?: MouseEventHandler }
> = ({ value, onChange, onClick }) => {
  const { chain } = useWallet()
  return (
    <div>
      <Form.Item
        extra={
          <Trans>
            The address of a{' '}
            <ExternalLink
              onClick={e => e.stopPropagation()}
              href={helpPagePath(`/dev/learn/glossary/ballot/`)}
            >
              ballot smart contract
            </ExternalLink>{' '}
            deployed to {chain?.name ?? 'mainnet'}.
          </Trans>
        }
      >
        <Input
          className="font-normal"
          value={value}
          placeholder={constants.AddressZero}
          onChange={e => onChange?.(e.target.value.toLowerCase())}
          onClick={onClick}
        />
      </Form.Item>
    </div>
  )
}
