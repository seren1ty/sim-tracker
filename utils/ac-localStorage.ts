import { AcTrackerState, AcTrackerGameState, Group, Game } from '@/types'
import { State } from '@/types'

const getItem = (key: string) => {
  const item =
    typeof window !== 'undefined' ? window.localStorage.getItem(key) : undefined

  return !!item ? JSON.parse(item) : undefined
}

const setItem = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getAcTrackerState = (): AcTrackerState => {
  const state = getItem('acTracker')

  if (!state) {
    let newState = {
      group: null,
      game: null,
      driver: null,
    }

    setAcTrackerState(newState)

    return newState
  }

  return state
}

export const setAcTrackerState = (state: AcTrackerState): void => {
  setItem('acTracker', state)
}

export const getGameState = (session: State | null) => {
  return getAcTrackerGameState(session?.group, session?.game)
}

export const setGameState = (
  session: State | null,
  state: AcTrackerGameState
) => {
  setAcTrackerGameState(session?.group, session?.game, state)
}

const getAcTrackerGameState = (
  group: Group | null | undefined,
  game: Game | null | undefined
): AcTrackerGameState => {
  let currGroup = group
  if (!currGroup) {
    currGroup = getAcTrackerState().group
  }

  let currGame = game
  if (!currGame) {
    currGame = getAcTrackerState().game
  }

  const state = getItem('acTracker_' + currGroup?._id + '_' + currGame?._id)

  if (!state) {
    let newState = {
      trackIdFilter: 'ALL',
      carIdFilter: 'ALL',
      driverIdFilter: 'ALL',
      sortType: 'DATE',

      currentLapToEdit: null,

      newLapDefaultTrackId: '',
      newLapDefaultCarId: '',
      newLapDefaultGearbox: 'Automatic',
      newLapDefaultTraction: 'Factory',
      newLapDefaultStability: 'Factory',
      newLapDefaultNotes: '',
    }

    setAcTrackerGameState(currGroup, currGame, newState)

    return newState
  }

  return state
}

const setAcTrackerGameState = (
  group: Group | null | undefined,
  game: Game | null | undefined,
  state: AcTrackerGameState
): void => {
  let currGroup = group
  if (!currGroup) {
    currGroup = getAcTrackerState().group
  }

  let currGame = game
  if (!currGame) {
    currGame = getAcTrackerState().game
  }

  setItem('acTracker_' + currGroup?._id + '_' + currGame?._id, state)
}
