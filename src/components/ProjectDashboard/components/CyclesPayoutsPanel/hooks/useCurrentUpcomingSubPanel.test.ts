/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { act } from 'react-dom/test-utils'
import { useCurrentUpcomingSubPanel } from './useCurrentUpcomingSubPanel'

// jest.mock('react')
jest.mock('components/ProjectDashboard/hooks')
jest.mock('hooks/v2v3/contractReader/useProjectUpcomingFundingCycle')

const mockUseProjectContext = useProjectContext as jest.MockedFunction<
  typeof useProjectContext
>
const mockUseProjectMetadata = useProjectMetadata as jest.MockedFunction<
  typeof useProjectMetadata
>
const mockUseProjectUpcomingFundingCycle =
  useProjectUpcomingFundingCycle as jest.MockedFunction<
    typeof useProjectUpcomingFundingCycle
  >

describe('useCurrentUpcomingSubPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Prime the mocks with default values
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(1),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    mockUseProjectMetadata.mockImplementation(() => ({ projectId: 1 } as any))
    mockUseProjectUpcomingFundingCycle.mockImplementation(
      () =>
        ({
          data: [{ duration: BigNumber.from(1) }],
          loading: false,
        } as any),
    )
  })
  it('returns current cycle number if type is current', () => {
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.cycleNumber).toEqual(1)
  })

  it('returns upcoming cycle number if type is upcoming', () => {
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('upcoming'))
    expect(result.current.cycleNumber).toEqual(2)
  })

  test('time remaining is updated every second', () => {
    jest.useFakeTimers().setSystemTime(1)
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.remainingTime).toEqual('0d 0h 0m 1s')
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.remainingTime).toEqual('0d 0h 0m 0s')
    jest.useRealTimers()
  })

  test('time remaining does not go negative', () => {
    jest.useFakeTimers().setSystemTime(1)
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.remainingTime).toEqual('0d 0h 0m 1s')
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(result.current.remainingTime).toEqual('0d 0h 0m 0s')
    jest.useRealTimers()
  })

  test('timer is cleared on unmount', () => {
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(5),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    jest.useFakeTimers().setSystemTime(5)
    const { result, unmount } = renderHook(() =>
      useCurrentUpcomingSubPanel('current'),
    )
    expect(result.current.remainingTime).toEqual('0d 0h 0m 5s')
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.remainingTime).toEqual('0d 0h 0m 4s')
    unmount()
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.remainingTime).toEqual('0d 0h 0m 4s')
    jest.useRealTimers()
  })

  test('upcoming cycleLength is formatted correctly', () => {
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('upcoming'))
    expect(result.current.cycleLength).toEqual('1 Second')
  })

  test.each(['current', 'upcoming'] as const)(
    'status always returns Locked',
    id => {
      const { result } = renderHook(() => useCurrentUpcomingSubPanel(id))
      expect(result.current.status).toEqual('Locked')
    },
  )

  test('current type doesnt wait for upcoming funding cycle', () => {
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(1),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    mockUseProjectUpcomingFundingCycle.mockImplementation(
      () =>
        ({
          data: [{ duration: BigNumber.from(1) }],
          loading: true,
        } as any),
    )
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.loading).toEqual(false)
  })

  test('upcoming type waits for upcoming funding cycle', () => {
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(1),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    mockUseProjectUpcomingFundingCycle.mockImplementation(
      () =>
        ({
          data: [{ duration: BigNumber.from(1) }],
          loading: true,
        } as any),
    )
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('upcoming'))
    expect(result.current.loading).toEqual(true)
  })
})
