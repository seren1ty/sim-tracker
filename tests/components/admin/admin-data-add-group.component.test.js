import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AdminDataAddGroup from '@/components/admin/admin-data-add-group.component';

describe('AdminDataAddGroup', () => {
  let expectedProps;

  beforeEach(() => {
    expectedProps = {
      onSave: jest.fn(),
      onCancel: jest.fn(),
    };
  });

  it('calls prop onSave when Save clicked', () => {
    act(() => {
      render(
        <AdminDataAddGroup
          onSave={expectedProps.onSave}
          onCancel={expectedProps.onCancel}
        />
      );
    });

    const saveButton = document.querySelector('#SaveButton');

    fireEvent.click(saveButton);

    expect(expectedProps.onSave).toBeCalled();
  });

  it('calls prop onCancel when Cancel clicked', () => {
    act(() => {
      render(
        <AdminDataAddGroup
          onSave={expectedProps.onSave}
          onCancel={expectedProps.onCancel}
        />
      );
    });

    const cancelButton = document.querySelector('#CancelButton');

    fireEvent.click(cancelButton);

    expect(expectedProps.onCancel).toBeCalled();
  });
});
