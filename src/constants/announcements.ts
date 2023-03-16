import IntroProjectTags from 'components/announcements/IntroProjectTags'
import IntroSepanaSearch from 'components/announcements/IntroSepanaSearch'
import { Announcement } from 'models/announcement'
import { NextRouter } from 'next/router'

export const announcements: Announcement[] = [
  {
    id: 'introProjectTags',
    conditions: [({ isProjectOwner }) => isProjectOwner],
    content: IntroProjectTags,
    expire: new Date('2023-04-01T00:00:00.000Z').valueOf(),
    cta: {
      text: 'Go to settings',
      fn: (router: NextRouter) => {
        router.push(router.asPath + '/settings?page=general')
      },
    },
  },
  {
    id: 'introSepanaSearch',
    conditions: [({ router }) => router.pathname.includes('projects')],
    content: IntroSepanaSearch,
    expire: new Date('2023-04-01T00:00:00.000Z').valueOf(),
  },
]

const expired = announcements.filter(
  a => a.expire && a.expire < Date.now().valueOf(),
)

if (expired.length) {
  // Just a friendly helper log
  console.warn(
    'Some announcements have expired and can be removed:',
    expired.map(e => e.id).join(', '),
  )
}
