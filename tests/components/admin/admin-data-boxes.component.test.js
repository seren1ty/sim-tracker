import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AdminDataBoxes from '@/components/admin/admin-data-boxes.component';

describe('AdminDataBoxes', () => {
  let expectedProps;

  beforeEach(() => {
    expectedProps = {
      data: [
        { _id: '1', name: 'DriverA', hasLaps: true },
        { _id: '2', name: 'DriverB', hasLaps: false },
      ],
      onUpdate: jest.fn(),
      onDelete: jest.fn(),
    };

    act(() => {
      render(
        <AdminDataBoxes
          data={expectedProps.data}
          onUpdate={expectedProps.onUpdate}
          onDelete={expectedProps.onDelete}
        />
      );
    });
  });

  it('loads correct number of boxes', () => {
    expect(screen.getByText('DriverA')).toBeInTheDocument();
    expect(screen.getByText('DriverB')).toBeInTheDocument();
  });

  it('hover databox with no laps displays delete button', () => {
    const dataBox = document.querySelector('#DataBox_2');

    expect(dataBox).toBeInTheDocument();

    expect(screen.queryByText('Delete')).toBeNull();

    fireEvent.mouseEnter(dataBox);

    expect(screen.queryByText('Delete')).toBeInTheDocument();
  });

  it('unhover databox with no laps removes delete button', () => {
    const dataBox = document.querySelector('#DataBox_2');

    expect(dataBox).toBeInTheDocument();

    fireEvent.mouseEnter(dataBox);

    expect(screen.queryByText('Delete')).toBeInTheDocument();

    fireEvent.mouseLeave(dataBox);

    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('hover databox with laps does not display delete button', () => {
    const dataBox = document.querySelector('#DataBox_1');

    expect(dataBox).toBeInTheDocument();

    expect(screen.queryByText('Delete')).toBeNull();

    fireEvent.mouseEnter(dataBox);

    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('click delete on hovered databox with no laps displays delete/cancel buttons', () => {
    const dataBox = document.querySelector('#DataBox_2');

    fireEvent.mouseEnter(dataBox);

    const deleteButton = screen.queryByText('Delete');
    expect(screen.queryByText('Cancel')).toBeNull();

    fireEvent.click(deleteButton);

    expect(screen.queryByText('Delete')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
  });
});
