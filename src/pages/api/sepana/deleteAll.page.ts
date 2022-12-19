import { NextApiHandler } from 'next'
import { deleteAllSepanaDocs } from './utils'

/**
 * Synchronizes the Sepana engine with the latest Juicebox Subgraph/IPFS data
 * TODO: REMOVE. Currently only needed for testing
 */
const handler: NextApiHandler = async (_, res) => {
  try {
    await deleteAllSepanaDocs()
  } catch (error) {
    res.status(500).send({
      message: 'Failed to delete Sepana docs',
      error,
    })
  }

  res.status(200).send('Deleted all Sepana docs')
}

export default handler
