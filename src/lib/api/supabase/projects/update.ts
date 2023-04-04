import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { DBProject } from 'models/dbProject'
import { Json } from 'models/json'
import { NextApiResponse } from 'next'
import { formatError } from 'utils/format/formatError'
import { formatWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import {
  getChangedSubgraphProjects,
  sgDbCompareKeys,
  tryResolveMetadata,
} from 'utils/sgDbProjects'
import { dbpQueryAll, writeDBProjects } from '.'
import { dbpLog } from './logger'

export async function updateDBProjects(
  res: NextApiResponse,
  retryIpfs: boolean,
) {
  try {
    // // TODO for testing
    // await dbProjects
    //   .delete({ count: 'exact' })
    //   .filter('id', 'not.eq', null)
    //   .then(res => {
    //     console.log('deleted all', { res })
    //   })

    // Load all projects from Supabase, store in dict
    const { data, error: queryError } = await dbpQueryAll()

    if (queryError) {
      throw new Error('Error querying projects: ' + queryError.message)
    }

    const dbProjects = (data as Json<DBProject>[])?.reduce(
      (acc, p) => ({
        ...acc,
        [p.id]: p,
      }),
      {} as Record<string, Json<DBProject>>,
    )

    // Load all projects from Subgraph
    const sgProjects = await querySubgraphExhaustiveRaw({
      entity: 'project',
      keys: sgDbCompareKeys,
    })

    const {
      changedSubgraphProjects,
      retryMetadataCount,
      updatedProperties,
      idsOfNewProjects,
    } = getChangedSubgraphProjects({
      sgProjects,
      dbProjects,
      retryIpfs,
    })

    const resolveMetadataResults = await Promise.all(
      changedSubgraphProjects.map(sgProject =>
        tryResolveMetadata({
          sgProject,
          ...dbProjects[sgProject.id],
        }),
      ),
    )

    const ipfsErrors = resolveMetadataResults.filter(r => r.error)

    // Write all updated projects (even those with missing metadata)
    const { error, data: updatedDBProjects } = await writeDBProjects(
      resolveMetadataResults.map(r => r.project),
    )

    if (error) {
      throw new Error('Error writing projects to Supabase: ' + error.message)
    }

    // Formatted message used for log reporting
    const reportString = `${
      retryMetadataCount
        ? `\nRetried resolving metadata for ${retryMetadataCount}`
        : ''
    }\n\n${resolveMetadataResults
      .filter(r => !r.error)
      .map(r => {
        const {
          project: { id, name },
        } = r

        const formatBigNumberish = (b: unknown) =>
          isBigNumberish(b) ? formatWad(b, { precision: 6 }) : b

        return `\`[${id}]\` ${name} _(${
          idsOfNewProjects.has(id as string)
            ? 'New'
            : updatedProperties[id]
                ?.map(
                  prop =>
                    `${prop.key}: ${formatBigNumberish(
                      prop.oldVal,
                    )} -> ${formatBigNumberish(prop.newVal)}`,
                )
                .join(', ') ?? 'no changes'
        })_`
      })
      .join('\n')}`

    // Log if any projects were updated
    if (updatedDBProjects.length) {
      await dbpLog(
        ipfsErrors.length
          ? {
              type: 'alert',
              alert: 'DB_UPDATE_ERROR',
              body: `Failed to resolve IPFS data for ${
                ipfsErrors.length
              } projects:\n${ipfsErrors
                .map(
                  e =>
                    `\`[${e.project.id}]\` metadataURI: \`${e.project.metadataUri}\`, ${e.retriesRemaining} retries remaining. _${e.error}_`,
                )
                .join('\n')}\n\n${reportString}`,
            }
          : {
              type: 'notification',
              notif: 'DB_UPDATED',
              body: reportString,
            },
      )
    }

    res.status(200).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      updates: {
        count: updatedDBProjects.length,
        projects: updatedDBProjects,
      },
      errors: { ipfsErrors, count: ipfsErrors.length },
    })
  } catch (error) {
    const _error = formatError(error)

    await dbpLog({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: _error,
    })

    res.status(500).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Error updating Supabase projects',
      error: _error,
    })
  }
}
