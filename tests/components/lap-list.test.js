import React from 'react';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LapList from '@/components/lap-list.component';

jest.mock('axios');

const lapData = [
  {
    car: 'Lamborghini Huracan GT3',
    createdAt: '2020-11-05T09:24:52.308Z',
    date: '2020-07-17T13:36:20.000Z',
    driver: 'Jimmy',
    game: 'Assetto Corsa',
    gearbox: 'Manual',
    laptime: '02:06.525',
    notes: '',
    stability: 'Off',
    track: 'Suzuka Circuit',
    traction: 'Factory',
    updatedAt: '2020-11-05T09:24:52.308Z',
    _id: '5f90c560585d09d5451a30ba',
  },
  {
    car: 'Pagani Zonda R',
    createdAt: '2020-10-22T00:24:58.864Z',
    date: '2020-10-11T16:23:10.000Z',
    driver: 'Jimmy',
    game: 'Assetto Corsa',
    gearbox: 'Manual',
    laptime: '02:05.185',
    notes: '',
    stability: 'Off',
    track: 'Suzuka Circuit',
    traction: 'Factory',
    updatedAt: '2020-11-05T09:24:38.690Z',
    _id: '5f90d15a2417a7301414913c',
  },
];

describe('LapList', () => {
  beforeEach(() => {});

  test('renders Lap List with loading screen', () => {
    render(<LapList />);

    expect(
      screen.getByText(/Loading your lap records.../i)
    ).toBeInTheDocument();
  });

  /*   test('renders page with lap list', async () => {
    axios.get.mockImplementationOnce(() => Promise.then(true))
               .mockImplementationOnce(() => Promise.then({ data: lapData }));

    render(<LapList />);

    expect(await screen.findByText(/Lap Records/i)).toBeInTheDocument();
  }); */
});
