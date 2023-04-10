import { Trans, t } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { SectionContainer } from './SectionContainer'

export const WhatDoWeValueSection = () => {
  return (
    <SectionContainer className="md:py-24">
      <h2 className="font-header text-4xl">
        <Trans>What do we value?</Trans>
      </h2>
      <p>
        <Trans>
          Open a full-featured Ethereum treasury with programmable spending in
          minutes.
        </Trans>
      </p>

      <div className="flex flex-wrap gap-4 md:mt-16 md:grid md:grid-cols-3 md:gap-8">
        <ValueBox
          // TODO: bg-melon-400
          className="bg-bluebs-400"
          title={t`Trust`}
          description={t`Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.`}
        />
        <ValueBox
          // TODO: bg-peel-400
          className="bg-tangerine-400"
          title={t`Transparency`}
          description={t`Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.`}
        />
        <ValueBox
          className="bg-grape-400"
          title={t`Reliability`}
          description={t`Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.`}
        />
        <ValueBox
          // TODO: bg-crush-400
          className="bg-error-200"
          title={t`Fun`}
          description={t`Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.`}
        />
        <ValueBox
          className="bg-bluebs-400"
          title={t`Community`}
          description={t`Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.`}
        />
        <ValueBox
          className="bg-split-400"
          title={t`Customization`}
          description={t`Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.`}
        />
      </div>
    </SectionContainer>
  )
}

const ValueBox = ({
  className,
  title,
  description,
}: {
  className?: string
  title: string
  description: string
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-2 rounded-lg py-4 px-3 text-center md:py-8 md:px-5',
        className,
      )}
    >
      <div className="text-2xl font-medium">{title}</div>
      <div>{description}</div>
    </div>
  )
}