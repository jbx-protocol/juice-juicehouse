import { Button, Col, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'
import { web3Modal } from 'utils/web3Modal'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { userAddress } = useContext(UserContext)
  const {
    onNeedProvider,
    onSelectWallet,
    onLogOut,
    usingBurnerProvider,
    wallet
  } = useContext(NetworkContext)

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  return (
    <div>
      <Row gutter={10} align="middle">
        {userAddress && (
          <Col>
            <Balance address={userAddress} showEthPrice />
          </Col>
        )}
        {userAddress && (
          <Col>
            <Wallet userAddress={userAddress}></Wallet>
          </Col>
        )}
        <Col>
          {!wallet ? (
            <Button onClick={onSelectWallet}>Connect</Button>
          ) : (
            <Button onClick={onLogOut}>Logout</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
