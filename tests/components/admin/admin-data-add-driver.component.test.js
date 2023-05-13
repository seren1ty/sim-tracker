import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AdminDataAddDriver from '@/components/admin/admin-data-add-driver.component';

describe('AdminDataAddDriver', () => {
  let expectedProps;

  beforeEach(() => {
    expectedProps = {
      onSave: jest.fn(),
      onCancel: jest.fn(),
    };
  });

  it('calls prop onSave when Save called', () => {
    act(() => {
      render(
        <AdminDataAddDriver
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
        <AdminDataAddDriver
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
