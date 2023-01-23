import { NextApiHandler } from 'next'
import { deleteAllSepanaDocs, sepanaAlert } from './utils'

const handler: NextApiHandler = async (_, res) => {
  try {
    await deleteAllSepanaDocs()
  } catch (error) {
    await sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: JSON.stringify(error),
    })

    res.status(500).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Failed to delete Sepana records',
      error,
    })
  }

  await sepanaAlert({ type: 'alert', alert: 'DELETED_ALL_RECORDS' })

  res.status(200).json({
    network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
    message: 'Deleted all Sepana records',
  })
}

export default handler
