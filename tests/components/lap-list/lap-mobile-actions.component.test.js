import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LapMobileActions from '@/components/lap-list/lap-mobile-actions.component'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock window.open
const mockWindowOpen = jest.fn()
global.window.open = mockWindowOpen

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
  replay: 'https://example.com/replay',
  notes: '',
}

const mockSessionDriver = {
  _id: 'driver1',
  name: 'Jimmy',
  groupIds: ['group1'],
  isAdmin: false,
}

const mockDeleteLap = jest.fn()
const mockOnClose = jest.fn()

const renderInTable = (ui) => {
  return render(
    <table>
      <tbody>
        <tr>{ui}</tr>
      </tbody>
    </table>
  )
}

describe('LapMobileActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Permission Checks', () => {
    it('shows Edit and Delete buttons only for current user\'s laps', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('hides Edit and Delete buttons for other users\' laps', () => {
      const differentDriver = { ...mockSessionDriver, name: 'Bobby' }
      renderInTable(
        <LapMobileActions
          sessionDriver={differentDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
      // Replay and Cancel should still be visible
      expect(screen.getByText('Replay')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('hides Edit and Delete buttons when sessionDriver is null', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={null}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
      // Replay and Cancel should still be visible
      expect(screen.getByText('Replay')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('always shows Replay button regardless of lap ownership', () => {
      const differentDriver = { ...mockSessionDriver, name: 'Bobby' }
      renderInTable(
        <LapMobileActions
          sessionDriver={differentDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Replay')).toBeInTheDocument()
    })

    it('always shows Cancel button regardless of lap ownership', () => {
      const differentDriver = { ...mockSessionDriver, name: 'Bobby' }
      renderInTable(
        <LapMobileActions
          sessionDriver={differentDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('shows only Replay and Cancel for non-owner when lap has replay', () => {
      const differentDriver = { ...mockSessionDriver, name: 'Bobby' }
      renderInTable(
        <LapMobileActions
          sessionDriver={differentDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Replay')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    })

    it('shows only Cancel for non-owner when lap has no replay', () => {
      const differentDriver = { ...mockSessionDriver, name: 'Bobby' }
      const lapWithoutReplay = { ...mockLap, replay: '' }
      renderInTable(
        <LapMobileActions
          sessionDriver={differentDriver}
          lap={lapWithoutReplay}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.queryByText('Replay')).not.toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    })
  })

  describe('Initial View - Lap with Replay', () => {
    it('renders all four buttons when lap has replay', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Replay')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getAllByText('Cancel')[0]).toBeInTheDocument()
    })

    it('Replay button has correct CSS class', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const replayButton = screen.getByText('Replay')
      expect(replayButton).toHaveClass('lap-mobile-replay')
    })

    it('opens replay in new window when Replay is clicked', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const replayButton = screen.getByText('Replay')
      fireEvent.click(replayButton)

      expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com/replay')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('stops event propagation when Replay is clicked', () => {
      const mockStopPropagation = jest.fn()
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const replayButton = screen.getByText('Replay')
      const event = new MouseEvent('click', { bubbles: true })
      event.stopPropagation = mockStopPropagation

      fireEvent(replayButton, event)

      expect(mockStopPropagation).toHaveBeenCalled()
    })
  })

  describe('Initial View - Lap without Replay', () => {
    const lapWithoutReplay = { ...mockLap, replay: '' }

    it('renders only three buttons when lap has no replay', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={lapWithoutReplay}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      expect(screen.queryByText('Replay')).not.toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getAllByText('Cancel')[0]).toBeInTheDocument()
    })

    it('does not call window.open when no replay URL', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={lapWithoutReplay}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      // Since Replay button doesn't exist, clicking Edit shouldn't open window
      const editButton = screen.getByText('Edit')
      fireEvent.click(editButton)

      expect(mockWindowOpen).not.toHaveBeenCalled()
    })
  })

  describe('Edit Functionality', () => {
    it('navigates to edit page when Edit is clicked', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
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

    it('Edit button has correct CSS class', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const editButton = screen.getByText('Edit')
      expect(editButton).toHaveClass('lap-mobile-edit')
    })

    it('stops event propagation when Edit is clicked', () => {
      const mockStopPropagation = jest.fn()
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const editButton = screen.getByText('Edit')
      const event = new MouseEvent('click', { bubbles: true })
      event.stopPropagation = mockStopPropagation

      fireEvent(editButton, event)

      expect(mockStopPropagation).toHaveBeenCalled()
    })
  })

  describe('Delete Confirmation Flow', () => {
    it('shows delete confirmation when Delete is clicked', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      // Initial buttons should be hidden
      expect(screen.queryByText('Replay')).not.toBeInTheDocument()
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()

      // Confirmation buttons should be visible
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('Delete button in initial view has correct CSS class', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const deleteButton = screen.getByText('Delete')
      expect(deleteButton).toHaveClass('lap-mobile-delete')
    })

    it('Delete confirm button has correct CSS class', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      const confirmButton = screen.getByText('Delete')
      expect(confirmButton).toHaveClass('lap-mobile-delete-confirm')
    })

    it('calls deleteLap and onClose when delete is confirmed', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      // Click initial Delete button
      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      // Click confirmation Delete button
      const confirmDeleteButton = screen.getByText('Delete')
      fireEvent.click(confirmDeleteButton)

      expect(mockDeleteLap).toHaveBeenCalledWith('123abc')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('returns to initial view when Cancel is clicked in delete confirmation', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      // Click initial Delete button
      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      // Click Cancel in confirmation
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      // Should return to initial view
      expect(screen.getByText('Replay')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('does not call deleteLap when Cancel is clicked', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      // Click initial Delete button
      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      // Click Cancel
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(mockDeleteLap).not.toHaveBeenCalled()
    })

    it('stops event propagation when Delete is clicked', () => {
      const mockStopPropagation = jest.fn()
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const deleteButton = screen.getByText('Delete')
      const event = new MouseEvent('click', { bubbles: true })
      event.stopPropagation = mockStopPropagation

      fireEvent(deleteButton, event)

      expect(mockStopPropagation).toHaveBeenCalled()
    })
  })

  describe('Cancel Functionality', () => {
    it('calls onClose when Cancel is clicked in initial view', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const cancelButtons = screen.getAllByText('Cancel')
      fireEvent.click(cancelButtons[0])

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('Cancel button in initial view has correct CSS class', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const cancelButtons = screen.getAllByText('Cancel')
      expect(cancelButtons[0]).toHaveClass('lap-mobile-cancel-link')
    })

    it('stops event propagation when Cancel is clicked in initial view', () => {
      const mockStopPropagation = jest.fn()
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const cancelButton = screen.getAllByText('Cancel')[0]
      const event = new MouseEvent('click', { bubbles: true })
      event.stopPropagation = mockStopPropagation

      fireEvent(cancelButton, event)

      expect(mockStopPropagation).toHaveBeenCalled()
    })
  })

  describe('Table Structure', () => {
    it('renders as a table cell with correct colspan', () => {
      const { container } = renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const cell = container.querySelector('td')
      expect(cell).toHaveAttribute('colspan', '10')
    })

    it('has correct CSS class for the cell', () => {
      const { container } = renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const cell = container.querySelector('td')
      expect(cell).toHaveClass('lap-mobile-actions-cell')
    })

    it('contains a container div with correct class', () => {
      const { container } = renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const containerDiv = container.querySelector('.lap-mobile-actions-container')
      expect(containerDiv).toBeInTheDocument()
    })
  })

  describe('Button Order', () => {
    it('displays buttons in correct order with replay: Replay, Edit, Delete, Cancel', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const buttons = screen.getAllByText(/Replay|Edit|Delete|Cancel/)
      expect(buttons[0]).toHaveTextContent('Replay')
      expect(buttons[1]).toHaveTextContent('Edit')
      expect(buttons[2]).toHaveTextContent('Delete')
      expect(buttons[3]).toHaveTextContent('Cancel')
    })

    it('displays buttons in correct order without replay: Edit, Delete, Cancel', () => {
      const lapWithoutReplay = { ...mockLap, replay: '' }
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={lapWithoutReplay}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const buttons = screen.getAllByText(/Edit|Delete|Cancel/)
      expect(buttons[0]).toHaveTextContent('Edit')
      expect(buttons[1]).toHaveTextContent('Delete')
      expect(buttons[2]).toHaveTextContent('Cancel')
    })

    it('displays delete confirmation buttons in correct order: Delete, Cancel', () => {
      renderInTable(
        <LapMobileActions
          sessionDriver={mockSessionDriver}
          lap={mockLap}
          deleteLap={mockDeleteLap}
          onClose={mockOnClose}
        />
      )

      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      const buttons = screen.getAllByText(/Delete|Cancel/)
      expect(buttons[0]).toHaveTextContent('Delete')
      expect(buttons[1]).toHaveTextContent('Cancel')
    })
  })
})
