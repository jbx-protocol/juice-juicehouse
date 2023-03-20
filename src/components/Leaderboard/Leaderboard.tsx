import { Trans } from '@lingui/macro'
import { Select } from 'antd'
import Loading from 'components/Loading'
import WalletCard from 'components/WalletCard'
import { useLeaderboard } from 'hooks/Leaderboard'
import { useWalletsQuery } from 'hooks/Wallets'
import { useState } from 'react'

export function Leaderboard() {
  const [window, setWindow] = useState<30 | 'allTime'>(30)

  const { data: allTimeWallets, isLoading } = useWalletsQuery({
    orderBy: 'totalPaid',
  })

  const windowWallets = useLeaderboard({
    count: 10,
    windowDays: typeof window === 'number' ? window : null,
  })

  const wallets = window === null ? allTimeWallets : windowWallets

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="flex flex-wrap items-start justify-between">
        <h1>Top Contributors</h1>{' '}
        <div>
          <Select
            className="small w-[200px]"
            value={window}
            onChange={val => setWindow(val)}
          >
            <Select.Option value={30}>
              <Trans>30 days</Trans>
            </Select.Option>
            <Select.Option value={'allTime'}>
              <Trans>All time</Trans>
            </Select.Option>
          </Select>
        </div>
      </header>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-2">
          {wallets?.map((w, i) => (
            <WalletCard key={w.id} wallet={w} rank={i} />
          ))}
        </div>
      )}
    </div>
  )
}
