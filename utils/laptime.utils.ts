import { Lap } from '@/types'

const getLapsForTrack = (laps: Lap[], trackId: string) => {
  return laps.filter((lap: Lap) => lap.trackId === trackId)
}

const getLapsForCar = (laps: Lap[], carId: string) => {
  return laps.filter((lap: Lap) => lap.carId === carId)
}

const getLapsForDriver = (laps: Lap[], driverId: string) => {
  return laps.filter((lap: Lap) => lap.driverId === driverId)
}

const sortByLaptime = (laps: Lap[]) => {
  const currentLaps = [...laps]

  currentLaps.sort((a, b) => {
    return a.laptime > b.laptime ? 1 : b.laptime > a.laptime ? -1 : 0
  })

  return currentLaps
}

export const isLapRecord = (laps: Lap[], currentLap: Lap): boolean => {
  const fastestLaps = sortByLaptime(laps)

  const lapsForTrack = getLapsForTrack(fastestLaps, currentLap.trackId)

  return (
    lapsForTrack.length === 0 ||
    lapsForTrack[0]._id === currentLap._id ||
    currentLap.laptime <= lapsForTrack[0].laptime
  )
}

export const isLapRecordForCar = (laps: Lap[], currentLap: Lap) => {
  const fastestLaps = sortByLaptime(laps)

  const lapsForTrack = getLapsForTrack(fastestLaps, currentLap.trackId)

  if (lapsForTrack.length === 0) {
    return false
  }

  const lapsForTrackCar = getLapsForCar(lapsForTrack, currentLap.carId)

  return (
    lapsForTrack[0]._id !== currentLap._id &&
    currentLap.laptime > lapsForTrack[0].laptime &&
    (lapsForTrackCar.length === 0 ||
      lapsForTrackCar[0]._id === currentLap._id ||
      currentLap.laptime <= lapsForTrackCar[0].laptime)
  )
}

export const isPersonalLapRecordForCar = (laps: Lap[], currentLap: Lap) => {
  const fastestLaps = sortByLaptime(laps)

  const lapsForTrack = getLapsForTrack(fastestLaps, currentLap.trackId)

  if (lapsForTrack.length === 0) {
    return false
  }

  const lapsForTrackCar = getLapsForCar(lapsForTrack, currentLap.carId)

  if (lapsForTrackCar.length === 0) {
    return false
  }

  const lapsForTrackCarDriver = getLapsForDriver(
    lapsForTrackCar,
    currentLap.driverId
  )

  return (
    lapsForTrack[0]._id !== currentLap._id &&
    currentLap.laptime > lapsForTrack[0].laptime &&
    lapsForTrackCar[0]._id !== currentLap._id &&
    currentLap.laptime > lapsForTrackCar[0].laptime &&
    (lapsForTrackCarDriver.length === 0 ||
      lapsForTrackCarDriver[0]._id === currentLap._id ||
      currentLap.laptime <= lapsForTrackCarDriver[0].laptime)
  )
}

export const generateSplitToFasterLap = (laps: Lap[], currentLap: Lap) => {
  if (!currentLap.laptime || currentLap.laptime.length < 9) {
    return null
  }

  const fastestLaps = sortByLaptime(laps)

  const lapsForTrack = getLapsForTrack(fastestLaps, currentLap.trackId)

  if (
    lapsForTrack.length === 0 ||
    lapsForTrack[0]._id === currentLap._id ||
    lapsForTrack[0].laptime === currentLap.laptime
  ) {
    return null
  }

  const lapsForTrackCar = getLapsForCar(lapsForTrack, currentLap.carId)

  if (
    lapsForTrackCar.length === 0 ||
    lapsForTrackCar[0]._id === currentLap._id ||
    lapsForTrackCar[0].laptime === currentLap.laptime
  ) {
    return null
  }

  const lapsForTrackCarDriver = getLapsForDriver(
    lapsForTrackCar,
    currentLap.driverId
  )

  if (lapsForTrackCarDriver.length === 0) {
    return null
  }

  // Slower then personal best
  if (lapsForTrackCarDriver[0].laptime < currentLap.laptime) {
    return diffToFormattedTime(
      lapToMillis(currentLap.laptime) -
        lapToMillis(lapsForTrackCarDriver[0].laptime)
    )
  }
  // Equal or Faster then personal best
  else if (
    lapsForTrackCarDriver[0]._id === currentLap._id ||
    lapsForTrackCarDriver[0].laptime === currentLap.laptime ||
    lapsForTrackCar[0].laptime < currentLap.laptime
  ) {
    return diffToFormattedTime(
      lapToMillis(currentLap.laptime) - lapToMillis(lapsForTrackCar[0].laptime)
    )
  }

  return null
}

export const generateSplitToSlowerLap = (laps: Lap[], currentLap: Lap) => {
  if (!currentLap.laptime || currentLap.laptime.length < 9) {
    return null
  }

  const fastestLaps = sortByLaptime(laps)

  const lapsForTrack = getLapsForTrack(fastestLaps, currentLap.trackId)

  if (lapsForTrack.length === 0) {
    return null
  } else if (
    currentLap._id !== lapsForTrack[0]._id &&
    currentLap.laptime < lapsForTrack[0].laptime
  ) {
    return diffToFormattedTime(
      lapToMillis(lapsForTrack[0].laptime) - lapToMillis(currentLap.laptime)
    )
  } else if (
    (lapsForTrack[0]._id === currentLap._id ||
      lapsForTrack[0].laptime === currentLap.laptime) &&
    lapsForTrack.length > 1
  ) {
    return diffToFormattedTime(
      lapToMillis(lapsForTrack[1].laptime) - lapToMillis(currentLap.laptime)
    )
  }

  const lapsForTrackCar = getLapsForCar(lapsForTrack, currentLap.carId)

  if (lapsForTrackCar.length === 0) return null
  else if (
    currentLap._id !== lapsForTrackCar[0]._id &&
    currentLap.laptime < lapsForTrackCar[0].laptime
  ) {
    return diffToFormattedTime(
      lapToMillis(lapsForTrackCar[0].laptime) - lapToMillis(currentLap.laptime)
    )
  } else if (
    (lapsForTrackCar[0]._id === currentLap._id ||
      lapsForTrackCar[0].laptime === currentLap.laptime) &&
    lapsForTrackCar.length > 1
  ) {
    return diffToFormattedTime(
      lapToMillis(lapsForTrackCar[1].laptime) - lapToMillis(currentLap.laptime)
    )
  }

  const lapsForTrackCarDriver = getLapsForDriver(
    lapsForTrackCar,
    currentLap.driverId
  )

  if (lapsForTrackCarDriver.length === 0) {
    return null
  } else if (
    currentLap._id !== lapsForTrackCarDriver[0]._id &&
    currentLap.laptime < lapsForTrackCarDriver[0].laptime
  ) {
    return diffToFormattedTime(
      lapToMillis(lapsForTrackCarDriver[0].laptime) -
        lapToMillis(currentLap.laptime)
    )
  } else if (
    (lapsForTrackCarDriver[0]._id === currentLap._id ||
      lapsForTrackCarDriver[0].laptime === currentLap.laptime) &&
    lapsForTrackCarDriver.length > 1
  ) {
    return diffToFormattedTime(
      lapToMillis(lapsForTrackCarDriver[1].laptime) -
        lapToMillis(currentLap.laptime)
    )
  }

  return null
}

const lapToMillis = (laptime: string) => {
  const fasterLapSplit = laptime.split(':')

  const fasterMin = parseInt(fasterLapSplit[0])
  const fasterSec = parseInt(fasterLapSplit[1].split('.')[0])
  const fasterMilli = parseInt(fasterLapSplit[1].split('.')[1])

  return fasterMin * 60 * 1000 + fasterSec * 1000 + fasterMilli
}

const diffToTime = (difference: number) => {
  let min, sec, mil

  min = Math.floor(difference / 1000 / 60)
  sec = Math.floor((difference / 1000 / 60 - min) * 60)
  mil = Math.floor(((difference / 1000 / 60 - min) * 60 - sec) * 1000)

  return { min, sec, mil }
}

const diffToFormattedTime = (difference: number) => {
  const { min, sec, mil } = diffToTime(difference)

  return (
    (min < 10 ? '0' + min : min) +
    ':' +
    (sec < 10 ? '0' + sec : sec) +
    '.' +
    (mil < 100 ? '0' : '') +
    (mil < 10 ? '0' + mil : mil)
  )
}
