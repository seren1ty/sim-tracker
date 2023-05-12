import { Lap } from "../types";

const sortByLaptime = (laps: Lap[]) => {
    let currentLaps = [...laps];

    currentLaps.sort((a,b) => {
        return (a.laptime > b.laptime) ? 1 : ((b.laptime > a.laptime) ? -1 : 0);
    });

    return currentLaps;
}

export const isLapRecord = (laps: Lap[], currentLap: Lap): boolean => {
    let fastestLaps = sortByLaptime(laps);

    let fastestLapsForTrack = fastestLaps.filter((lap: Lap) => lap.track === currentLap.track);

    return (fastestLapsForTrack.length === 0 ||
            fastestLapsForTrack[0]._id === currentLap._id ||
            currentLap.laptime <= fastestLapsForTrack[0].laptime);
}

export const isLapRecordForCar = (laps: Lap[], currentLap: Lap) => {
    let fastestLaps = sortByLaptime(laps);

    let fastestLapsForTrack = fastestLaps.filter((lap: Lap) => lap.track === currentLap.track);

    if (fastestLapsForTrack.length === 0)
        return false;

    let fastestLapsForTrackCar = fastestLapsForTrack.filter((lap: Lap) => lap.car === currentLap.car);

    return (fastestLapsForTrack[0]._id !== currentLap._id &&
            currentLap.laptime > fastestLapsForTrack[0].laptime &&
            (fastestLapsForTrackCar.length === 0 ||
             fastestLapsForTrackCar[0]._id === currentLap._id ||
             currentLap.laptime <= fastestLapsForTrackCar[0].laptime));
}

export const isPersonalLapRecordForCar = (laps: Lap[], currentLap: Lap) => {
    let fastestLaps = sortByLaptime(laps);

    let fastestLapsForTrack = fastestLaps.filter((lap: Lap) => lap.track === currentLap.track);

    if (fastestLapsForTrack.length === 0)
        return false;

    let fastestLapsForTrackCar = fastestLapsForTrack.filter((lap: Lap) => lap.car === currentLap.car);

    if (fastestLapsForTrackCar.length === 0)
        return false;

    let fastestLapsForTrackCarDriver = fastestLapsForTrackCar.filter((lap: Lap) => lap.driver === currentLap.driver);

    return (fastestLapsForTrack[0]._id !== currentLap._id &&
            currentLap.laptime > fastestLapsForTrack[0].laptime &&
            fastestLapsForTrackCar[0]._id !== currentLap._id &&
            currentLap.laptime > fastestLapsForTrackCar[0].laptime &&
            (fastestLapsForTrackCarDriver.length === 0 ||
             fastestLapsForTrackCarDriver[0]._id === currentLap._id ||
             currentLap.laptime <= fastestLapsForTrackCarDriver[0].laptime));
}

export const generateSplitToFasterLap = (laps: Lap[], currentLap: Lap) => {
    if (!currentLap.laptime || currentLap.laptime.length < 9)
        return null;

    let fastestLaps = sortByLaptime(laps);

    let fastestLapsForTrack = fastestLaps.filter((lap: Lap) => lap.track === currentLap.track);

    if (fastestLapsForTrack.length === 0 ||
        fastestLapsForTrack[0]._id === currentLap._id ||
        fastestLapsForTrack[0].laptime === currentLap.laptime)
        return null;

    let fastestLapsForTrackCar = fastestLapsForTrack.filter((lap: Lap) => lap.car === currentLap.car);

    if (fastestLapsForTrackCar.length === 0 ||
        fastestLapsForTrackCar[0]._id === currentLap._id ||
        fastestLapsForTrackCar[0].laptime === currentLap.laptime)
        return null;

    let fastestLapsForTrackCarDriver = fastestLapsForTrackCar.filter((lap: Lap) => lap.driver === currentLap.driver);

    if (fastestLapsForTrackCarDriver.length === 0)
        return null;

    // Slower then personal best
    if (fastestLapsForTrackCarDriver[0].laptime < currentLap.laptime) {
        return diffToFormattedTime(lapToMillis(currentLap.laptime) - lapToMillis(fastestLapsForTrackCarDriver[0].laptime));
    }
    // Equal or Faster then personal best
    else if (fastestLapsForTrackCarDriver[0]._id === currentLap._id ||
             fastestLapsForTrackCarDriver[0].laptime === currentLap.laptime ||
             fastestLapsForTrackCar[0].laptime < currentLap.laptime) {
        return diffToFormattedTime(lapToMillis(currentLap.laptime) - lapToMillis(fastestLapsForTrackCar[0].laptime));
    }

    return null;
}

export const generateSplitToSlowerLap = (laps: Lap[], currentLap: Lap) => {
    if (!currentLap.laptime || currentLap.laptime.length < 9)
        return null;

    let fastestLaps = sortByLaptime(laps);

    let fastestLapsForTrack = fastestLaps.filter((lap: Lap) => lap.track === currentLap.track);

    if (fastestLapsForTrack.length === 0)
        return null;
    else if (currentLap._id !== fastestLapsForTrack[0]._id &&
             currentLap.laptime < fastestLapsForTrack[0].laptime) {
        return diffToFormattedTime(lapToMillis(fastestLapsForTrack[0].laptime) - lapToMillis(currentLap.laptime));
    }
    else if ((fastestLapsForTrack[0]._id === currentLap._id ||
              fastestLapsForTrack[0].laptime === currentLap.laptime) &&
             fastestLapsForTrack.length > 1) {
        return diffToFormattedTime(lapToMillis(fastestLapsForTrack[1].laptime) - lapToMillis(currentLap.laptime));
    }

    let fastestLapsForTrackCar = fastestLapsForTrack.filter((lap: Lap) => lap.car === currentLap.car);

    if (fastestLapsForTrackCar.length === 0)
        return null;
    else if (currentLap._id !== fastestLapsForTrackCar[0]._id &&
             currentLap.laptime < fastestLapsForTrackCar[0].laptime) {
        return diffToFormattedTime(lapToMillis(fastestLapsForTrackCar[0].laptime) - lapToMillis(currentLap.laptime));
    }
    else if ((fastestLapsForTrackCar[0]._id === currentLap._id ||
              fastestLapsForTrackCar[0].laptime === currentLap.laptime) &&
             fastestLapsForTrackCar.length > 1) {
        return diffToFormattedTime(lapToMillis(fastestLapsForTrackCar[1].laptime) - lapToMillis(currentLap.laptime));;
    }

    let fastestLapsForTrackCarDriver = fastestLapsForTrackCar.filter((lap: Lap) => lap.driver === currentLap.driver);

    if (fastestLapsForTrackCarDriver.length === 0)
        return null;
    else if (currentLap._id !== fastestLapsForTrackCarDriver[0]._id &&
             currentLap.laptime < fastestLapsForTrackCarDriver[0].laptime) {
        return diffToFormattedTime(lapToMillis(fastestLapsForTrackCarDriver[0].laptime) - lapToMillis(currentLap.laptime));
    }
    else if ((fastestLapsForTrackCarDriver[0]._id === currentLap._id ||
              fastestLapsForTrackCarDriver[0].laptime === currentLap.laptime) &&
             fastestLapsForTrackCarDriver.length > 1) {
        return diffToFormattedTime(lapToMillis(fastestLapsForTrackCarDriver[1].laptime) - lapToMillis(currentLap.laptime));;
    }

    return null;
}

const lapToMillis = (laptime: string) => {
    const fasterLapSplit = laptime.split(':');

    const fasterMin = parseInt(fasterLapSplit[0]);
    const fasterSec = parseInt(fasterLapSplit[1].split('.')[0]);
    const fasterMilli = parseInt(fasterLapSplit[1].split('.')[1]);

    return (fasterMin * 60 * 1000) + (fasterSec * 1000) + fasterMilli;
}

const diffToTime = (difference: number) => {
    let min,sec,mil;

    min = Math.floor(difference/1000/60);
    sec = Math.floor((difference/1000/60 - min)*60);
    mil = Math.floor(((difference/1000/60 - min)*60 - sec)*1000);

    return {min, sec, mil};
}

const diffToFormattedTime = (difference: number) => {
    const {min, sec, mil} = diffToTime(difference);

    return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec) + '.' + (mil < 100 ? '0' : '') + (mil < 10 ? '0' + mil : mil);
}