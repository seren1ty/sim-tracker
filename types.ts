export type AcTrackerState = {
  group: string | null;
  game: string | null;
  driver: Driver | null;
};

export type AcTrackerGameState = {
  trackType: string;
  carType: string;
  driverType: string;
  sortType: string;

  currentLapToEdit: any | null;

  newLapDefaultTrack: string;
  newLapDefaultCar: string;
  newLapDefaultGearbox: string;
  newLapDefaultTraction: string;
  newLapDefaultStability: string;
  newLapDefaultNotes: string;
};

export type State = {
  showMobile: boolean;
  loading: boolean;
  group: string | null;
  game: string | null;
  driver: Driver | null;
  setShowMobile: (showMobile: boolean) => void;
  setLoading: (loading: boolean) => void;
  setGroup: (group: string) => void;
  setGame: (game: string) => void;
  setDriver: (driver: Driver | null) => void;
};

type MongooseDocument<T> = {
  _doc: T;
};

export type LapDocument = MongooseDocument<Lap> & Lap;
export type Lap = {
  _id: string;
  game: string;
  track: string;
  car: string;
  driver: string;
  laptime: string;
  gearbox: string;
  traction: string;
  stability: string;
  date: Date;
  replay: string;
  notes: string;

  isLapRecord?: boolean;
  isLapRecordForCar?: boolean;
  isPersonalLapRecordForCar?: boolean;
  laptimeDetails?: string;
};

export type HoveredLap = {
  _id: string;
  type: string;
  data: string;
};

export type TrackDocument = MongooseDocument<Track> & Track;
export type Track = {
  _id: string;
  game: string;
  name: string;
  hasLaps?: boolean;
};

export type CarDocument = MongooseDocument<Car> & Car;
export type Car = {
  _id: string;
  game: string;
  name: string;
  hasLaps?: boolean;
};

export type DriverDocument = MongooseDocument<Driver> & Driver;
export type Driver = {
  _id: string;
  name: string;
  isAdmin: boolean;
  email?: string;
  hasLaps?: boolean;
};

export type NewDriver = {
  name: string;
  email: string;
  isAdmin?: boolean;
};

export type GameDocument = MongooseDocument<Game> & Game;
export type Game = {
  _id: string;
  name: string;
  code: string;
  hasLaps?: boolean;
};

export type GroupDocument = MongooseDocument<Group> & Group;
export type Group = {
  _id: string;
  name: string;
  code: string;
  description: string;
  ownerId: string;
};

export type NewGroup = {
  name: string;
  code: string;
  description?: string;
  ownerId?: string;
};
