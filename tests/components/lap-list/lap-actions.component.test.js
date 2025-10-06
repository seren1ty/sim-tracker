import { act } from 'react-dom/test-utils'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import LapActions from '@/components/lap-list/lap-actions.component'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockLap = {
  _id: '123abc',
  driver: 'Jimmy',
  groupId: 'group1',
  group: 'Test Group',
  gameId: 'game1',
  game: 'Assetto Corsa',
  trackId: 'track1',
  track: 'Suzuka Circuit',
  carId: 'car1',
  car: 'Lamborghini Huracan GT3',
  driverId: 'driver1',
  laptime: '02:06.525',
  gearbox: 'Manual',
  traction: 'Factory',
  stability: 'Off',
  date: new Date('2020-07-17T13:36:20.000Z'),
  replay: '',
  notes: '',
}

const mockSessionDriver = {
  _id: 'driver1',
  name: 'Jimmy',
  groupIds: ['group1'],
  isAdmin: false,
}

const mockDeleteLap = jest.fn()

describe('LapActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when session driver is null', () => {
    const { container } = render(
      <LapActions
        sessionDriver={null}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })

  it('renders nothing when drivers are not equal', () => {
    const differentDriver = { ...mockSessionDriver, name: 'Bobby' }

    const { container } = render(
      <LapActions
        sessionDriver={differentDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })

  it('renders Edit and Delete buttons initially when drivers are equal', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  it('Edit and Delete buttons are enabled when drivers match', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    const editButton = screen.getByText('Edit')
    const deleteButton = screen.getByText('Delete')

    expect(editButton).not.toBeDisabled()
    expect(deleteButton).not.toBeDisabled()
  })

  it('navigates to edit page when Edit button is clicked', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(mockPush).toHaveBeenCalledWith(
      {
        pathname: '/edit-lap/123abc',
        query: { lap: JSON.stringify(mockLap) },
      },
      '/edit-lap/123abc'
    )
  })

  it('shows Delete and Cancel buttons after clicking Delete', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls deleteLap when Delete is confirmed', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    // Click initial Delete button to show confirmation
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    // Click the confirmation Delete button
    const confirmButtons = screen.getAllByText('Delete')
    const confirmDeleteButton = confirmButtons[0] // The danger button
    fireEvent.click(confirmDeleteButton)

    expect(mockDeleteLap).toHaveBeenCalledWith('123abc')
  })

  it('hides confirmation when Cancel is clicked', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    // Click initial Delete button to show confirmation
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()

    // Click Cancel
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    // Should return to initial state
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  it('does not call deleteLap when Cancel is clicked', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    // Click initial Delete button to show confirmation
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    // Click Cancel
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockDeleteLap).not.toHaveBeenCalled()
  })

  it('has correct CSS classes for buttons', () => {
    render(
      <LapActions
        sessionDriver={mockSessionDriver}
        lap={mockLap}
        deleteLap={mockDeleteLap}
      />
    )

    const editButton = screen.getByText('Edit')
    const deleteButton = screen.getByText('Delete')

    expect(editButton).toHaveClass('edit-btn', 'btn', 'btn-sm', 'btn-primary')
    expect(deleteButton).toHaveClass('delete-btn', 'btn', 'btn-sm', 'btn-danger')
  })
})
