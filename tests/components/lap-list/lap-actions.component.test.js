import { act } from 'react-dom/test-utils';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import LapActions from '@/components/lap-list/lap-actions.component';

let expectedData;

beforeEach(() => {
  expectedData = {
    sessionDriver: 'Jimmy',
    lap: {
      driver: 'Jimmy',
    },
    deleteLap: () => {},
  };
});

it('renders nothing when drivers are not equal', () => {
  expectedData.sessionDriver = 'Bobby';

  act(() => {
    render(
      <LapActions
        sessionDriver={expectedData.sessionDriver}
        lap={expectedData.lap}
        deleteLap={expectedData.deleteLap}
      />
    );
  });

  expect(screen.queryByText('Edit')).toBeNull();
  expect(screen.queryByText('Delete')).toBeNull();
});

it('renders Edit and Delete buttons initially when drivers are equal', () => {
  act(() => {
    render(
      <LapActions
        sessionDriver={expectedData.sessionDriver}
        lap={expectedData.lap}
        deleteLap={expectedData.deleteLap}
      />
    );
  });

  expect(screen.getByText('Edit')).toBeInTheDocument();
  expect(screen.getByText('Delete')).toBeInTheDocument();
});

it('renders Delete and Cancel buttons after clicking Delete when drivers are equal', () => {
  act(() => {
    render(
      <LapActions
        sessionDriver={expectedData.sessionDriver}
        lap={expectedData.lap}
        deleteLap={expectedData.deleteLap}
      />
    );
  });

  expect(screen.getByText('Edit')).toBeInTheDocument();
  expect(screen.queryByText('Cancel')).toBeNull();

  const button = document.querySelector('#DeleteButton');

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(screen.queryByText('Edit')).toBeNull();

  expect(screen.getByText('Delete')).toBeInTheDocument();
  expect(screen.getByText('Cancel')).toBeInTheDocument();
});
