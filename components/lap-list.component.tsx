import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { isBefore, isAfter } from 'date-fns'
import LapItem from './lap-list/lap-item.component'
import { StateContext } from '@/context/state.context'
import {
  isLapRecord,
  isLapRecordForCar,
  isPersonalLapRecordForCar,
} from '@/utils/laptime.utils'
import { Car, Driver, HoveredLap, Lap, Track } from '@/types'
import { getGameState, setGameState } from '@/utils/ac-localStorage'
import SkeletonLaps from './skeleton/skeleton-laps.component'

const LapList: React.FC = () => {
  const state = useContext(StateContext)

  const { data: session, status } = useSession()

  const [originalLaps, setOriginalLaps] = useState([])

  const [laps, setLaps] = useState<Lap[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])

  const [hoveredLap, setHoveredLap] = useState<HoveredLap | null>(null)

  const router = useRouter()

  useEffect(() => {
    handleLoadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, state?.group, state?.game])

  const handleLoadData = () => {
    if (!session || !session.user || !state) {
      return
    }

    state.setLoading(true)

    axios
      .get('/api/laps/game/' + state.game?._id)
      .then((res) => {
        setOriginalLaps(res.data)

        handleSetLaps(res.data)

        state.setLoading(false)
      })
      .catch((err) => {
        console.error(err)
      })

    axios
      .get('/api/tracks/game/' + state.game?._id)
      .then((res) => {
        handleSetTracks(res.data)
      })
      .catch((err) => {
        console.error(err)
      })

    axios
      .get('/api/cars/game/' + state.game?._id)
      .then((res) => {
        handleSetCars(res.data)
      })
      .catch((err) => {
        console.error(err)
      })

    axios
      .get('/api/drivers')
      .then((res) => {
        handleSetDrivers(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleSetLaps = (newLaps: Lap[]) => {
    let sortedLaps = handleChangeSort(getGameState(state).sortType, newLaps)

    console.log('==== laps: ' + sortedLaps.length)

    console.log('==== trackIdFilter: ' + getGameState(state).trackIdFilter)
    if (getGameState(state).trackIdFilter !== 'ALL') {
      sortedLaps = sortedLaps.filter(
        (lap: Lap) => lap.trackId === getGameState(state).trackIdFilter
      )
    }

    console.log('==== carIdFilter: ' + getGameState(state).carIdFilter)
    if (getGameState(state).carIdFilter !== 'ALL') {
      sortedLaps = sortedLaps.filter(
        (lap: Lap) => lap.carId === getGameState(state).carIdFilter
      )
    }

    console.log('==== driverIdFilter: ' + getGameState(state).driverIdFilter)
    if (getGameState(state).driverIdFilter !== 'ALL') {
      sortedLaps = sortedLaps.filter(
        (lap: Lap) => lap.driverId === getGameState(state).driverIdFilter
      )
    }

    console.log('==== laps: ' + sortedLaps.length)
    setLaps(sortedLaps)
  }

  const handleSetTracks = (newTracks: Track[]) => {
    newTracks.sort((a, b) => {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    })

    setTracks(newTracks)
  }

  const handleSetCars = (newCars: Car[]) => {
    newCars.sort((a, b) => {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    })

    setCars(newCars)
  }

  const handleSetDrivers = (newDrivers: Driver[]) => {
    newDrivers.sort((a, b) => {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    })

    setDrivers(newDrivers)
  }

  const onClickAdd = () => {
    router.push('/add-lap')
  }

  const onChangeTrack = (trackEvent: React.ChangeEvent<HTMLSelectElement>) => {
    handleChangeTrack(trackEvent.target.value)

    setGameState(state, {
      ...getGameState(state),
      trackIdFilter: trackEvent.target.value,
    })
  }

  const handleChangeTrack = (newTrackId: string) => {
    let filteredLaps

    filteredLaps = [...originalLaps]

    filteredLaps = handleChangeSort(getGameState(state).sortType, filteredLaps)

    if (getGameState(state).driverIdFilter !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.driverId === getGameState(state).driverIdFilter
      )

    if (getGameState(state).carIdFilter !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.carId === getGameState(state).carIdFilter
      )

    if (newTrackId !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.trackId === newTrackId
      )

    setLaps(filteredLaps)
  }

  const onChangeCar = (carEvent: React.ChangeEvent<HTMLSelectElement>) => {
    handleChangeCar(carEvent.target.value)

    setGameState(state, {
      ...getGameState(state),
      carIdFilter: carEvent.target.value,
    })
  }

  const handleChangeCar = (newCarId: string) => {
    let filteredLaps

    filteredLaps = [...originalLaps]

    filteredLaps = handleChangeSort(getGameState(state).sortType, filteredLaps)

    if (getGameState(state).trackIdFilter !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.trackId === getGameState(state).trackIdFilter
      )

    if (getGameState(state).driverIdFilter !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.driverId === getGameState(state).driverIdFilter
      )

    if (newCarId !== 'ALL')
      filteredLaps = filteredLaps.filter((lap: Lap) => lap.carId === newCarId)

    setLaps(filteredLaps)
  }

  const onChangeDriver = (
    driverEvent: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChangeDriver(driverEvent.target.value)

    setGameState(state, {
      ...getGameState(state),
      driverIdFilter: driverEvent.target.value,
    })
  }

  const handleChangeDriver = (newDriverId: string) => {
    let filteredLaps

    filteredLaps = [...originalLaps]

    filteredLaps = handleChangeSort(getGameState(state).sortType, filteredLaps)

    if (getGameState(state).trackIdFilter !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.trackId === getGameState(state).trackIdFilter
      )

    if (getGameState(state).carIdFilter !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.carId === getGameState(state).carIdFilter
      )

    if (newDriverId !== 'ALL')
      filteredLaps = filteredLaps.filter(
        (lap: Lap) => lap.driverId === newDriverId
      )

    setLaps(filteredLaps)
  }

  const onChangeSort = (sortEvent: React.ChangeEvent<HTMLSelectElement>) => {
    setGameState(state, {
      ...getGameState(state),
      sortType: sortEvent.target.value,
    })

    const sortedLaps = handleChangeSort(sortEvent.target.value)

    setLaps(sortedLaps)
  }

  const handleChangeSort = (newSortType: string, newLaps?: Lap[]) => {
    let currentLaps = newLaps ? newLaps : [...laps]
    console.log('==== laps: ' + currentLaps.length)

    if (newSortType === 'TRACK') {
      currentLaps.sort((a, b) => {
        return a.laptime > b.laptime ? 1 : b.laptime > a.laptime ? -1 : 0
      })

      currentLaps.sort((a, b) => {
        return a.track > b.track ? 1 : b.track > a.track ? -1 : 0
      })
    } else if (newSortType === 'CAR') {
      currentLaps.sort((a, b) => {
        return a.laptime > b.laptime ? 1 : b.laptime > a.laptime ? -1 : 0
      })

      currentLaps.sort((a, b) => {
        return a.car > b.car ? 1 : b.car > a.car ? -1 : 0
      })
    } else if (newSortType === 'DRIVER') {
      currentLaps.sort((a, b) => {
        return a.laptime > b.laptime ? 1 : b.laptime > a.laptime ? -1 : 0
      })

      currentLaps.sort((a, b) => {
        return a.driver > b.driver ? 1 : b.driver > a.driver ? -1 : 0
      })
    } else if (newSortType === 'LAPTIME') {
      currentLaps.sort((a, b) => {
        return a.laptime > b.laptime ? 1 : b.laptime > a.laptime ? -1 : 0
      })
    } else if (newSortType === 'DATE') {
      currentLaps.sort((a, b) => {
        return a.laptime > b.laptime ? 1 : b.laptime > a.laptime ? -1 : 0
      })

      currentLaps.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        const aBiggerB = isBefore(dateA, dateB)
          ? 1
          : isAfter(dateA, dateB)
          ? -1
          : 0

        return aBiggerB
      })
    }

    return currentLaps
  }

  const checkLapRecord = (currentLap: Lap) => {
    return isLapRecord(originalLaps, currentLap)
  }

  const checkLapRecordForCar = (currentLap: Lap) => {
    return isLapRecordForCar(originalLaps, currentLap)
  }

  const checkPersonalLapRecordForCar = (currentLap: Lap) => {
    return isPersonalLapRecordForCar(originalLaps, currentLap)
  }

  const deleteLap = (id: string) => {
    axios
      .delete('/api/laps/' + id)
      .then((res) => {
        setLaps(laps.filter((lap: Lap) => lap._id !== id))

        setOriginalLaps(originalLaps.filter((lap: Lap) => lap._id !== id))

        router.push('/')
      })
      .catch((err) => {
        console.error('Error [Delete Lap]: ' + err)
      })
  }

  const onHoverLap = (currHoveredLap: HoveredLap | null) => {
    setHoveredLap(currHoveredLap)
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <>
      <div className="lap-list-page">
        <div className="lap-title-row">
          <span className="lap-title">Lap Records</span>
          <span className="lap-add-holder">
            <button
              className="add-lap-btn btn btn-primary sub-item"
              type="button"
              onClick={onClickAdd}
            >
              Add New Lap
            </button>
          </span>
        </div>
        {!state || state.loading ? (
          <SkeletonLaps />
        ) : (
          <>
            <div className="lap-filter-labels pt-3 mr-0">
              <span className="lap-filter-md">
                <select
                  className="lap-filter-select"
                  onChange={onChangeTrack}
                  value={getGameState(state).trackIdFilter}
                >
                  <option value="ALL">All Tracks</option>
                  {tracks.map((track) => {
                    return (
                      <option value={track._id} key={track._id}>
                        {track.name}
                      </option>
                    )
                  })}
                </select>
              </span>
              <span className="lap-filter-md sub-item">
                <select
                  className="lap-filter-select"
                  onChange={onChangeCar}
                  value={getGameState(state).carIdFilter}
                >
                  <option value="ALL">All Cars</option>
                  {cars.map((car) => {
                    return (
                      <option value={car._id} key={car._id}>
                        {car.name}
                      </option>
                    )
                  })}
                </select>
              </span>
              <span className="lap-filter-lg">
                <select
                  className="lap-filter-select"
                  onChange={onChangeDriver}
                  value={getGameState(state).driverIdFilter}
                >
                  <option value="ALL">All Drivers</option>
                  {drivers.map((driver) => {
                    return (
                      <option value={driver._id} key={driver._id}>
                        {driver.name}
                      </option>
                    )
                  })}
                </select>
              </span>
              <span className="sub-item">
                <label>Sort by </label>
                <select
                  className="lap-filter-select"
                  onChange={onChangeSort}
                  value={getGameState(state).sortType}
                >
                  <option value="DATE">Date</option>
                  <option value="TRACK">Track</option>
                  <option value="CAR">Car</option>
                  <option value="DRIVER">Driver</option>
                  <option value="LAPTIME">Laptime</option>
                </select>
              </span>
              <span className="laps-shown">
                <span className="sub-item">Laps: </span>
                <span>
                  {laps.length} / {originalLaps.length}
                </span>
              </span>
            </div>

            <table className="table table-hover mt-2">
              <thead className="thead-light lap-header">
                <tr>
                  <th>Track</th>
                  <th>Car</th>
                  <th className="sub-item"></th>
                  <th>Laptime</th>
                  <th>Driver</th>
                  <th className="sub-item">Gears</th>
                  <th className="sub-item">TC</th>
                  <th className="sub-item">SC</th>
                  <th>Date</th>
                  <th className="sub-item"></th>
                  <th className="actions-heading sub-item">Actions</th>
                </tr>
              </thead>

              <tbody>
                {laps.map((lap) => (
                  <LapItem
                    lap={lap}
                    isLapRecord={checkLapRecord}
                    isLapRecordForCar={checkLapRecordForCar}
                    isPersonalLapRecordForCar={checkPersonalLapRecordForCar}
                    deleteLap={deleteLap}
                    key={lap._id}
                    onHover={onHoverLap}
                    hoveredLap={hoveredLap}
                  />
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}

export default LapList
