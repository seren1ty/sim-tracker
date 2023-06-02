import { Lap } from '@/types'
import {
  generateSplitToFasterLap,
  generateSplitToSlowerLap,
  isLapRecord,
  isLapRecordForCar,
  isPersonalLapRecordForCar,
} from './laptime.utils'

// Car A
const testLapDefault1 = {
  _id: '1',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_a',
  carId: 'car_a_id',
  driver: 'driver_a',
  driverId: 'driver_a_id',
  laptime: '01:00.000',
} as Lap

const testLapDefault2 = {
  _id: '2',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_a',
  carId: 'car_a_id',
  driver: 'driver_b',
  driverId: 'driver_b_id',
  laptime: '02:00.000',
} as Lap

const testLapDefault3 = {
  _id: '3',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_a',
  carId: 'car_a_id',
  driver: 'driver_b',
  driverId: 'driver_b_id',
  laptime: '03:00.000',
} as Lap

// Car B
const testLapDefault4 = {
  _id: '4',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_b',
  carId: 'car_b_id',
  driver: 'driver_c',
  driverId: 'driver_c_id',
  laptime: '04:00.000',
} as Lap

const testLapDefault5 = {
  _id: '5',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_b',
  carId: 'car_b_id',
  driver: 'driver_d',
  driverId: 'driver_d_id',
  laptime: '05:00.000',
} as Lap

const testLapDefault6 = {
  _id: '6',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_b',
  carId: 'car_b_id',
  driver: 'driver_d',
  driverId: 'driver_d_id',
  laptime: '06:00.000',
} as Lap

const testLapDefault7 = {
  _id: '7',
  track: 'track_a',
  trackId: 'track_a_id',
  car: 'car_b',
  carId: 'car_b_id',
  driver: 'driver_d',
  driverId: 'driver_d_id',
  laptime: '07:00.000',
} as Lap

const testLapDefaults = [
  testLapDefault1,
  testLapDefault2,
  testLapDefault3,
  testLapDefault4,
  testLapDefault5,
  testLapDefault6,
  testLapDefault7,
] as Lap[]

describe('LapTime Utils', () => {
  beforeEach(() => {})

  describe('isLapRecord', () => {
    it('is record when 0 laps exist', () => {
      const result = isLapRecord([], testLapDefault1)

      expect(result).toBe(true)
    })

    it('is record when only 1 lap exists', () => {
      const laps = [testLapDefault1]

      const result = isLapRecord(laps, testLapDefault1)

      expect(result).toBe(true)
    })

    it('is record when fastest lap has matching id', () => {
      const lap = { ...testLapDefault3, _id: '1' }

      const result = isLapRecord(testLapDefaults, lap)

      expect(result).toBe(true)
    })

    it('is record when lap has fastest laptime', () => {
      const result = isLapRecord(testLapDefaults, testLapDefault1)

      expect(result).toBe(true)
    })
  })

  describe('isLapRecordForCar', () => {
    it('is not record when 0 laps exist', () => {
      const result = isLapRecordForCar([], testLapDefault1)

      expect(result).toBe(false)
    })

    it('is not record when only 1 lap exists', () => {
      const laps = [testLapDefault1]

      const result = isLapRecordForCar(laps, testLapDefault1)

      expect(result).toBe(false)
    })

    it('is not record when fastest lap has matching id', () => {
      const result = isLapRecordForCar(testLapDefaults, testLapDefault1)

      expect(result).toBe(false)
    })

    it('is record when 0 laps exist for car at track', () => {
      const laps = [testLapDefault1, testLapDefault2]
      const lap = testLapDefault4

      const result = isLapRecordForCar(laps, lap)

      expect(result).toBe(true)
    })

    it('is record when fastest lap for car at track has matching id', () => {
      const laps = testLapDefaults
      const lap = testLapDefault4

      const result = isLapRecordForCar(laps, lap)

      expect(result).toBe(true)
    })

    it('is record when lap for car at track has fastest laptime', () => {
      const laps = [testLapDefault1, testLapDefault5]
      const lap = testLapDefault4

      const result = isLapRecordForCar(laps, lap)

      expect(result).toBe(true)
    })
  })

  describe('isPersonalLapRecordForCar', () => {
    it('is not record when 0 laps exist', () => {
      const result = isPersonalLapRecordForCar([], testLapDefault1)

      expect(result).toBe(false)
    })

    it('is not record when only 1 lap exists', () => {
      const laps = [testLapDefault1]

      const result = isPersonalLapRecordForCar(laps, testLapDefault1)

      expect(result).toBe(false)
    })

    it('is not record when fastest lap has matching id', () => {
      const result = isPersonalLapRecordForCar(testLapDefaults, testLapDefault1)

      expect(result).toBe(false)
    })

    it('is not record when 0 laps exist for car at track', () => {
      const laps = [testLapDefault1, testLapDefault2]
      const lap = testLapDefault4

      const result = isPersonalLapRecordForCar(laps, lap)

      expect(result).toBe(false)
    })

    it('is record when fastest lap for driver in car at track has matching id', () => {
      const laps = testLapDefaults
      const lap = testLapDefault5

      const result = isPersonalLapRecordForCar(laps, lap)

      expect(result).toBe(true)
    })

    it('is record when lap for driver in car at track has fastest laptime', () => {
      const laps = [testLapDefault1, testLapDefault4, testLapDefault6]
      const lap = testLapDefault5

      const result = isPersonalLapRecordForCar(laps, lap)

      expect(result).toBe(true)
    })
  })

  describe('generateSplitToFasterLap', () => {
    it('is slower then fastest lap', () => {
      const result = generateSplitToFasterLap(testLapDefaults, testLapDefault2)

      expect(result).toBe('01:00.000')
    })

    it('is not slower then fastest lap', () => {
      const result = generateSplitToFasterLap(testLapDefaults, testLapDefault1)

      expect(result).toBeNull()
    })

    it('is slower then fastest lap for car', () => {
      const result = generateSplitToFasterLap(testLapDefaults, testLapDefault3)

      expect(result).toBe('01:00.000')
    })

    it('is not slower then fastest lap for car', () => {
      const result = generateSplitToFasterLap(testLapDefaults, testLapDefault4)

      expect(result).toBeNull()
    })

    it('is slower then fastest lap for driver in car', () => {
      const result = generateSplitToFasterLap(testLapDefaults, testLapDefault5)

      expect(result).toBe('01:00.000')
    })
  })

  describe('generateSplitToSlowerLap', () => {
    it('is faster then fastest lap', () => {
      const laps = [testLapDefault2, testLapDefault3]

      const result = generateSplitToSlowerLap(laps, testLapDefault1)

      expect(result).toBe('01:00.000')
    })

    it('is not faster then fastest lap', () => {
      const laps = [testLapDefault1, testLapDefault2]
      const lap = { ...testLapDefault1, _id: '100', laptime: '01:00.001' }

      const result = generateSplitToSlowerLap(laps, lap)

      expect(result).toBeNull()
    })

    it('is faster then fastest lap for car', () => {
      const laps = [testLapDefault3, testLapDefault5]

      const result = generateSplitToSlowerLap(laps, testLapDefault4)

      expect(result).toBe('01:00.000')
    })

    it('is not faster then fastest lap for car', () => {
      const lap = { ...testLapDefault4, _id: '100', laptime: '04:00.001' }

      const result = generateSplitToSlowerLap(testLapDefaults, lap)

      expect(result).toBeNull()
    })

    it('is faster then fastest lap for driver in car', () => {
      const result = generateSplitToSlowerLap(testLapDefaults, testLapDefault5)

      expect(result).toBe('01:00.000')
    })
  })
})
