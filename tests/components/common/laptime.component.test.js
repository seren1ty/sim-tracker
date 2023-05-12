import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import Laptime from '../../../components/common/laptime.component';

let expectedLap;

beforeEach(() => {
    expectedLap = {
        car: "Lamborghini Huracan GT3",
        driver: "Jimmy",
        laptime: "02:06.525",
        _id: "5f90c560585d09d5451a30ba",
        isLapRecord: true
    };
})

it('renders with laptime', () => {
    act(() => {
        render(<Laptime lap={expectedLap}/>);
    });

    expect(screen.getByText('02:06.525')).toBeInTheDocument();
});

it('renders with expected tooltip text for track record', () => {
    expectedLap.isLapRecord = true;

    act(() => {
        render(<Laptime lap={expectedLap}/>);
    });

    expect(screen.getByText('Track Record across all cars')).toBeInTheDocument();
});

it('renders with expected tooltip text for track record for car', () => {
    expectedLap.isLapRecordForCar = true;

    act(() => {
        render(<Laptime lap={expectedLap}/>);
    });

    expect(screen.getByText('Track Record for the ' + expectedLap.car)).toBeInTheDocument();
});

it('renders with expected tooltip text for track record for car and driver', () => {
    expectedLap.isPersonalLapRecordForCar = true;

    act(() => {
        render(<Laptime lap={expectedLap} />);
    });

    expect(screen.getByText('Personal best lap for ' + expectedLap.driver + ' in the ' + expectedLap.car)).toBeInTheDocument();
});