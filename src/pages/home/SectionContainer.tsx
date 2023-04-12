import { PropsWithChildren } from 'react'

export function SectionContainer({
  children,
}: PropsWithChildren<Record<never, never>>) {
  return (
    <section className="w-full py-20">
      <div className="m-auto max-w-7xl px-5 md:px-10">{children}</div>
    </section>
  )
}
