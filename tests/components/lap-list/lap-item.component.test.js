import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { StateContext } from '@/context/state.context'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { priority, ...imgProps } = props
    return <img {...imgProps} />
  },
}))

// Mock react-tooltip
jest.mock('react-tooltip', () => ({
  Tooltip: () => null,
}))

// Mock LapActions component
jest.mock('components/lap-list/lap-actions.component', () => {
  return function MockLapActions() {
    return <div data-testid="lap-actions">Lap Actions</div>
  }
})

// Mock LapMobileActions component
jest.mock('components/lap-list/lap-mobile-actions.component', () => {
  return function MockLapMobileActions() {
    return <td data-testid="lap-mobile-actions">Mobile Actions</td>
  }
})

// Mock localStorage utility
jest.mock('utils/ac-localStorage', () => ({
  getGameState: jest.fn(() => ({
    driverIdFilter: '',
  })),
}))

import LapItem from '@/components/lap-list/lap-item.component'

const mockLap = {
  _id: '123abc',
  groupId: 'group1',
  group: 'Test Group',
  gameId: 'game1',
  game: 'Assetto Corsa',
  trackId: 'track1',
  track: 'Suzuka Circuit',
  carId: 'car1',
  car: 'Lamborghini Huracan GT3',
  driverId: 'driver1',
  driver: 'Jimmy',
  laptime: '02:06.525',
  gearbox: 'Manual',
  traction: 'Factory',
  stability: 'Off',
  date: new Date('2020-07-17T13:36:20.000Z'),
  replay: 'https://example.com/replay',
  notes: 'Great lap!',
}

const defaultProps = {
  lap: mockLap,
  hoveredLap: null,
  isLapRecord: jest.fn(() => false),
  isLapRecordForCar: jest.fn(() => false),
  isPersonalLapRecordForCar: jest.fn(() => false),
  deleteLap: jest.fn(),
  onHover: jest.fn(),
  showMobileActions: false,
  onToggleMobileActions: jest.fn(),
}

const mockStateContext = {
  showMobile: false,
  loadingGame: false,
  loading: false,
  group: null,
  game: null,
  driver: { _id: 'driver1', name: 'Jimmy', groupIds: ['group1'], isAdmin: false },
  setShowMobile: jest.fn(),
  setLoadingGame: jest.fn(),
  setLoading: jest.fn(),
  setGroup: jest.fn(),
  setGame: jest.fn(),
  setDriver: jest.fn(),
}

const renderWithContext = (ui, contextValue = mockStateContext) => {
  return render(
    <StateContext.Provider value={contextValue}>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </StateContext.Provider>
  )
}

describe('LapItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders lap item with all data in desktop mode', () => {
    renderWithContext(<LapItem {...defaultProps} />)

    expect(screen.getByText('Suzuka Circuit')).toBeInTheDocument()
    expect(screen.getByText('Lamborghini Huracan GT3')).toBeInTheDocument()
    expect(screen.getByText('Jimmy')).toBeInTheDocument()
    expect(screen.getByText('Manual')).toBeInTheDocument()
    expect(screen.getByText('Factory')).toBeInTheDocument()
    expect(screen.getByText('Off')).toBeInTheDocument()
    expect(screen.getByTestId('lap-actions')).toBeInTheDocument()
  })

  test('renders replay icon when replay URL exists', () => {
    renderWithContext(<LapItem {...defaultProps} />)

    const replayLink = screen.getByRole('link')
    expect(replayLink).toHaveAttribute('href', 'https://example.com/replay')
    expect(replayLink).toHaveAttribute('target', '_')
  })

  test('does not render replay icon when no replay URL', () => {
    const lapWithoutReplay = { ...mockLap, replay: '' }
    const props = { ...defaultProps, lap: lapWithoutReplay }

    renderWithContext(<LapItem {...props} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  test('renders notes icon when notes exist', () => {
    renderWithContext(<LapItem {...defaultProps} />)

    const notesIcon = screen.getByAltText('notes')
    expect(notesIcon).toBeInTheDocument()
  })

  test('does not render notes icon when no notes', () => {
    const lapWithoutNotes = { ...mockLap, notes: '' }
    const props = { ...defaultProps, lap: lapWithoutNotes }

    renderWithContext(<LapItem {...props} />)

    expect(screen.queryByAltText('notes')).not.toBeInTheDocument()
  })

  test('highlights driver\'s lap when not filtered and lap is for current driver', () => {
    const { getGameState } = require('utils/ac-localStorage')
    getGameState.mockReturnValue({ driverIdFilter: '' })

    const { container } = renderWithContext(<LapItem {...defaultProps} />)

    const row = container.querySelector('.lap-row')
    expect(row).toHaveClass('drivers-lap')
  })

  test('does not highlight driver\'s lap when filtered by driver', () => {
    const { getGameState } = require('utils/ac-localStorage')
    getGameState.mockReturnValue({ driverIdFilter: 'driver1' })

    const { container } = renderWithContext(<LapItem {...defaultProps} />)

    const row = container.querySelector('.lap-row')
    expect(row).not.toHaveClass('drivers-lap')
  })

  test('calls onHover when hovering over track', () => {
    renderWithContext(<LapItem {...defaultProps} />)

    const trackElement = screen.getByText('Suzuka Circuit')

    fireEvent.mouseEnter(trackElement)
    expect(defaultProps.onHover).toHaveBeenCalledWith({
      _id: '123abc',
      type: 'Track',
      data: 'track1',
    })

    fireEvent.mouseLeave(trackElement)
    expect(defaultProps.onHover).toHaveBeenCalledWith(null)
  })

  test('calls onHover when hovering over car', () => {
    renderWithContext(<LapItem {...defaultProps} />)

    const carElement = screen.getByText('Lamborghini Huracan GT3')

    fireEvent.mouseEnter(carElement)
    expect(defaultProps.onHover).toHaveBeenCalledWith({
      _id: '123abc',
      type: 'Car',
      data: 'car1',
    })

    fireEvent.mouseLeave(carElement)
    expect(defaultProps.onHover).toHaveBeenCalledWith(null)
  })

  test('applies text-strong class when lap data is hovered', () => {
    const hoveredLapData = {
      _id: '123abc',
      type: 'Track',
      data: 'track1',
    }
    const props = { ...defaultProps, hoveredLap: hoveredLapData }

    const { container } = renderWithContext(<LapItem {...props} />)

    // Find the span with text-strong class
    const strongSpan = container.querySelector('.text-strong')
    expect(strongSpan).toBeInTheDocument()
    expect(strongSpan).toContainHTML('Suzuka Circuit')
  })

  test('renders mobile actions when showMobileActions is true and showMobile is true', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const props = { ...defaultProps, showMobileActions: true }

    renderWithContext(<LapItem {...props} />, mobileContext)

    expect(screen.getByTestId('lap-mobile-actions')).toBeInTheDocument()
    expect(screen.queryByText('Suzuka Circuit')).not.toBeInTheDocument()
  })

  test('does not render mobile actions in desktop mode even if showMobileActions is true', () => {
    const props = { ...defaultProps, showMobileActions: true }

    renderWithContext(<LapItem {...props} />)

    expect(screen.queryByTestId('lap-mobile-actions')).not.toBeInTheDocument()
    expect(screen.getByText('Suzuka Circuit')).toBeInTheDocument()
  })

  test('clicking lap row in mobile mode toggles mobile actions', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const { container } = renderWithContext(<LapItem {...defaultProps} />, mobileContext)

    const row = container.querySelector('.lap-row')
    fireEvent.click(row)

    expect(defaultProps.onToggleMobileActions).toHaveBeenCalledWith('123abc')
  })

  test('clicking lap row when mobile actions are shown closes them', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const props = { ...defaultProps, showMobileActions: true }
    const { container } = renderWithContext(<LapItem {...props} />, mobileContext)

    const row = container.querySelector('.lap-row')
    fireEvent.click(row)

    expect(props.onToggleMobileActions).toHaveBeenCalledWith(null)
  })

  test('clicking lap row in desktop mode does nothing', () => {
    const { container } = renderWithContext(<LapItem {...defaultProps} />)

    const row = container.querySelector('.lap-row')
    fireEvent.click(row)

    expect(defaultProps.onToggleMobileActions).not.toHaveBeenCalled()
  })

  test('clicking lap row in mobile mode does nothing when user does not own lap and no replay exists', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const differentDriver = { ...mockStateContext.driver, name: 'Bobby' }
    const contextWithDifferentDriver = { ...mobileContext, driver: differentDriver }
    const lapWithoutReplay = { ...mockLap, replay: '' }
    const props = { ...defaultProps, lap: lapWithoutReplay }

    const { container } = renderWithContext(<LapItem {...props} />, contextWithDifferentDriver)

    const row = container.querySelector('.lap-row')
    fireEvent.click(row)

    expect(props.onToggleMobileActions).not.toHaveBeenCalled()
  })

  test('clicking lap row in mobile mode works when user does not own lap but replay exists', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const differentDriver = { ...mockStateContext.driver, name: 'Bobby' }
    const contextWithDifferentDriver = { ...mobileContext, driver: differentDriver }

    const { container } = renderWithContext(<LapItem {...defaultProps} />, contextWithDifferentDriver)

    const row = container.querySelector('.lap-row')
    fireEvent.click(row)

    expect(defaultProps.onToggleMobileActions).toHaveBeenCalledWith('123abc')
  })

  test('clicking lap row in mobile mode works when user owns lap but no replay exists', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const lapWithoutReplay = { ...mockLap, replay: '' }
    const props = { ...defaultProps, lap: lapWithoutReplay }

    const { container } = renderWithContext(<LapItem {...props} />, mobileContext)

    const row = container.querySelector('.lap-row')
    fireEvent.click(row)

    expect(props.onToggleMobileActions).toHaveBeenCalledWith('123abc')
  })

  test('adds has-replay class to first cell when replay exists in mobile mode', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const { container } = renderWithContext(<LapItem {...defaultProps} />, mobileContext)

    const firstCell = container.querySelector('td')
    expect(firstCell).toHaveClass('has-replay')
  })

  test('does not add has-replay class when no replay in mobile mode', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const lapWithoutReplay = { ...mockLap, replay: '' }
    const props = { ...defaultProps, lap: lapWithoutReplay }
    const { container } = renderWithContext(<LapItem {...props} />, mobileContext)

    const firstCell = container.querySelector('td')
    expect(firstCell).not.toHaveClass('has-replay')
  })

  test('adds mobile-actions-active class to row when mobile actions are shown', () => {
    const mobileContext = { ...mockStateContext, showMobile: true }
    const props = { ...defaultProps, showMobileActions: true }
    const { container } = renderWithContext(<LapItem {...props} />, mobileContext)

    const row = container.querySelector('.lap-row')
    expect(row).toHaveClass('mobile-actions-active')
  })

  test('displays Auto for automatic gearbox', () => {
    const lapWithAuto = { ...mockLap, gearbox: 'Automatic' }
    const props = { ...defaultProps, lap: lapWithAuto }

    renderWithContext(<LapItem {...props} />)

    expect(screen.getByText('Auto')).toBeInTheDocument()
  })
})
