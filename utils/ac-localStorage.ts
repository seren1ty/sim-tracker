import { AcTrackerState, AcTrackerGameState } from "../types";
import { Session } from "../types";

export const getAcTrackerState = (): AcTrackerState => {
    const stateStr = localStorage.getItem('acTracker');

    if (!stateStr) {
        let newState = {
            group: null,
            game: null,
            driver: null
        };

        setAcTrackerState(newState);

        return newState;
    }

    return JSON.parse(stateStr);
}

export const setAcTrackerState = (state: AcTrackerState): void => {
    localStorage.setItem('acTracker', JSON.stringify(state));
}

export const getGameState = (session: Session | null) => {
    return getAcTrackerGameState(session?.group, session?.game);
}

export const setGameState = (session: Session | null, state: AcTrackerGameState) => {
    setAcTrackerGameState(session?.group, session?.game, state);
}

const getAcTrackerGameState = (
        group: string | null | undefined,
        game: string | null | undefined
    ): AcTrackerGameState => {

    let currGroup = group;
    if (!currGroup)
        currGroup = getAcTrackerState().group;

    let currGame = game;
    if (!currGame)
        currGame = getAcTrackerState().game;

    const stateStr = localStorage.getItem('acTracker_' + currGroup + '_' + currGame);

    if (!stateStr) {
        let newState = {
            trackType: 'ALL',
            carType: 'ALL',
            driverType: 'ALL',
            sortType: 'DATE',

            currentLapToEdit: null,

            newLapDefaultTrack: '',
            newLapDefaultCar: '',
            newLapDefaultGearbox: 'Automatic',
            newLapDefaultTraction: 'Factory',
            newLapDefaultStability: 'Factory',
            newLapDefaultNotes: ''
        };

        setAcTrackerGameState(currGroup, currGame, newState);

        return newState;
    }

    return JSON.parse(stateStr);
}

const setAcTrackerGameState = (
        group: string | null | undefined,
        game: string | null | undefined,
        state: AcTrackerGameState
    ): void => {

    let currGroup = group;
    if (!currGroup)
        currGroup = getAcTrackerState().group;

    let currGame = game;
    if (!currGame)
        currGame = getAcTrackerState().game;

    localStorage.setItem('acTracker_' + currGroup + '_' + currGame, JSON.stringify(state));
}
