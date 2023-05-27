import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { act } from 'react-dom/test-utils'
import AcDate from '@/components/common/ac-date.component'

describe('AcDate', () => {
  it('renders with date', () => {
    act(() => {
      render(<AcDate date="2020-07-17T13:36:20.000Z" />)
    })

    expect(screen.getByText('17/07/20')).toBeInTheDocument()
  })
})
