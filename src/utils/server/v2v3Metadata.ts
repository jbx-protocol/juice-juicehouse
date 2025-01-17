/* eslint-disable @typescript-eslint/no-explicit-any */
import { CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { loadV2V3Contract } from 'packages/v2v3/utils/loadV2V3Contract'

export const V2V3GetMetadataCidFromContract = async (projectId: number) => {
  const JBProjects = await loadV2V3Contract(
    V2V3ContractName.JBProjects,
    readNetwork.name,
    readProvider,
    CV_V3, // Note: v2 and v3 use the same JBProjects, so the CV doesn't matter.
  )
  if (!JBProjects) {
    throw new Error(`contract not found ${V2V3ContractName.JBProjects}`)
  }
  const metadataCid = (await JBProjects.metadataContentOf(
    projectId,
    JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
  )) as string

  return metadataCid
}
