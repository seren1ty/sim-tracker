export type AcTrackerState = {
  group: Group | null
  game: Game | null
  driver: Driver | null
}

export type AcTrackerGameState = {
  trackIdFilter: string
  carIdFilter: string
  driverIdFilter: string
  sortType: string

  currentLapToEdit: any | null

  newLapDefaultTrackId: string
  newLapDefaultCarId: string
  newLapDefaultGearbox: string
  newLapDefaultTraction: string
  newLapDefaultStability: string
  newLapDefaultNotes: string
}

export type State = {
  showMobile: boolean
  loading: boolean
  group: Group | null
  game: Game | null
  driver: Driver | null
  setShowMobile: (showMobile: boolean) => void
  setLoading: (loading: boolean) => void
  setGroup: (group: Group) => void
  setGame: (game: Game) => void
  setDriver: (driver: Driver | null) => void
}

type MongooseDocument<T> = {
  _doc: T
}

export type LapDocument = MongooseDocument<Lap> & Lap
export type Lap = {
  _id: string
  groupId: string
  group: string
  gameId: string
  game: string
  trackId: string
  track: string
  carId: string
  car: string
  driverId: string
  driver: string
  laptime: string
  gearbox: string
  traction: string
  stability: string
  date: Date
  replay: string
  notes: string

  isLapRecord?: boolean
  isLapRecordForCar?: boolean
  isPersonalLapRecordForCar?: boolean
  laptimeDetails?: string
}

export type HoveredLap = {
  _id: string
  type: string
  data: string
}

export type TrackDocument = MongooseDocument<Track> & Track
export type Track = {
  _id: string
  groupId: string
  gameId: string
  game: string
  name: string
  hasLaps?: boolean
}

export type CarDocument = MongooseDocument<Car> & Car
export type Car = {
  _id: string
  groupId: string
  gameId: string
  game: string
  name: string
  hasLaps?: boolean
}

export type DriverDocument = MongooseDocument<Driver> & Driver
export type Driver = {
  _id: string
  groupId: string
  name: string
  isAdmin: boolean
  email?: string
  hasLaps?: boolean
}

export type NewDriver = {
  name: string
  email: string
  isAdmin?: boolean
}

export type GameDocument = MongooseDocument<Game> & Game
export type Game = {
  _id: string
  groupId: string
  name: string
  code: string
  hasLaps?: boolean
}

export type GroupDocument = MongooseDocument<Group> & Group
export type Group = {
  _id: string
  name: string
  code: string
  description: string
  ownerId: string
  driverIds: string[]
}

export type NewGroup = {
  name: string
  code: string
  description?: string
  ownerId?: string
}
