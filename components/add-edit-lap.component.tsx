import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { StateContext } from '@/context/state.context'
import {
  generateSplitToFasterLap,
  generateSplitToSlowerLap,
  isLapRecord,
  isLapRecordForCar,
  isPersonalLapRecordForCar,
} from '@/utils/laptime.utils'
import { Car, Game, Lap, Track } from '@/types'
import { getGameState, setGameState } from '@/utils/ac-localStorage'
import Link from 'next/link'
import SkeletonAddEditLap from './skeleton/skeleton-add-edit-lap.component'

const AddEditLap: React.FC = () => {
  const state = useContext(StateContext)

  const { data: session } = useSession()

  const router = useRouter()

  const rawLap = useMemo(() => {
    return !!router.query.lap ? JSON.parse(router.query.lap as string) : null
  }, [router])

  const [existingLap] = useState(() => {
    if (rawLap) {
      return rawLap
    } else if (router.pathname.startsWith('/edit-lap')) {
      if (getGameState(state)) {
        let storedCurrentLap = getGameState(state).currentLapToEdit

        if (
          storedCurrentLap &&
          location.pathname.endsWith(storedCurrentLap._id)
        )
          return storedCurrentLap
      }
    }

    return null
  })

  const [laps, setLaps] = useState<Lap[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [cars, setCars] = useState<Car[]>([])

  const [loading, setLoading] = useState(!tracks.length || !cars.length)

  const [addTrackInProgress, setAddTrackInProgress] = useState(false)
  const [newTrackName, setNewTrackName] = useState('')
  const newTrackId = useRef('')

  const [addCarInProgress, setAddCarInProgress] = useState(false)
  const [newCarName, setNewCarName] = useState('')
  const newCarId = useRef('')

  const [submitClicked, setSubmitClicked] = useState(false)

  const [game, setGame] = useState<Game | null | undefined>()

  const [trackId, setTrackId] = useState(() => {
    return existingLap
      ? existingLap.trackId
      : getGameState(state).newLapDefaultTrackId
  })
  const [trackName, setTrackName] = useState(() => {
    return existingLap ? existingLap.track : ''
  })

  const [carId, setCarId] = useState(() => {
    return existingLap
      ? existingLap.carId
      : getGameState(state).newLapDefaultCarId
  })
  const [carName, setCarName] = useState(() => {
    return existingLap ? existingLap.car : ''
  })

  const [laptime, setLaptime] = useState(() =>
    existingLap ? existingLap.laptime : ''
  )

  const [driverId] = useState(() =>
    state ? state?.driver?._id : existingLap ? existingLap.driverId : ''
  )
  const [driverName] = useState(() =>
    state ? state?.driver?.name : existingLap ? existingLap.driver : ''
  )

  const [gearbox, setGearbox] = useState(() => {
    return existingLap
      ? existingLap.gearbox
      : getGameState(state).newLapDefaultGearbox
  })

  const [traction, setTraction] = useState(() => {
    return existingLap
      ? existingLap.traction
      : getGameState(state).newLapDefaultTraction
  })

  const [stability, setStability] = useState(() => {
    return existingLap
      ? existingLap.stability
      : getGameState(state).newLapDefaultStability
  })

  const [date, setDate] = useState(() =>
    existingLap ? new Date(existingLap.date) : new Date()
  )

  const [replay, setReplay] = useState(() =>
    existingLap ? existingLap.replay : ''
  )

  const [notes, setNotes] = useState(() => {
    return existingLap
      ? existingLap.notes
      : getGameState(state).newLapDefaultNotes
  })

  const [splitToFasterLap, setSplitToFasterLap] = useState<string | null>(null)
  const [splitToSlowerLap, setSplitToSlowerLap] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    if (!session || !session.user || !state) {
      return
    }

    if (!existingLap && location.pathname.startsWith('/edit-lap')) {
      router.push('/')
    }

    setGame(state.game)

    const gamesPromise = axios
      .get('/api/laps/game/' + state.game?._id)
      .then((res) => {
        if (res.data.length > 0) {
          setLaps(res.data)
        }
      })
      .catch((err) => {
        console.error('Error [Get Laps]: ' + err)
      })

    const tracksPromise = axios
      .get('/api/tracks/game/' + state.game?._id)
      .then((res) => {
        if (res.data.length > 0) {
          setTracks(res.data)

          if (!trackId) {
            setTrackId(res.data[0]._id)
          }
        }
      })
      .catch((err) => {
        console.error('Error [Get Tracks]: ' + err)
      })

    const carsPromise = axios
      .get('/api/cars/game/' + state.game?._id)
      .then((res) => {
        if (res.data.length > 0) {
          setCars(res.data)

          if (!carId) {
            setCarId(res.data[0]._id)
          }
        }
      })
      .catch((err) => {
        console.error('Error [Get Cars]: ' + err)
      })

    Promise.all([gamesPromise, tracksPromise, carsPromise]).then(() => {
      setLoading(false)
    })

    // We are currently editting a lap, NOT creating a new one
    if (rawLap && location.pathname.startsWith('/edit-lap')) {
      setGameState(state, {
        ...getGameState(state),
        currentLapToEdit: rawLap,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If game is switched whilst adding/editting a lap, redirect to main lap list
  useEffect(() => {
    if (!!game) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.game])

  useEffect(() => {
    setSplitToFasterLap(handleGenerateSplitToFasterLap())
    setSplitToSlowerLap(handleGenerateSplitToSlowerLap())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laps, trackId, carId, laptime])

  const onChangeTrack = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    setTrackId(event.target.value)
    setTrackName(tracks.find((t) => t._id === id)?.name)
  }

  const onChangeCar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    setCarId(event.target.value)
    setCarName(cars.find((c) => c._id === id)?.name)
  }

  const onChangeLaptime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLaptime(event.target.value)
  }

  const onChangeGearbox = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGearbox(event.target.value)
  }

  const onChangeTraction = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTraction(event.target.value)
  }

  const onChangeStability = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStability(event.target.value)
  }

  const onChangeDate = (newDate: Date) => {
    setDate(newDate)
  }

  const onChangeReplay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReplay(event.target.value)
  }

  const onChangeNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value)
  }

  const onClickAddTrack = () => {
    setAddTrackInProgress(true)
  }

  const onClickCancelAddTrack = () => {
    setAddTrackInProgress(false)
  }

  const onChangeNewTrackName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrackName(event.target.value)
  }

  const onClickAddCar = () => {
    setAddCarInProgress(true)
  }

  const onClickCancelAddCar = () => {
    setAddCarInProgress(false)
  }

  const onChangeNewCarName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCarName(event.target.value)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitClicked(true)

    if (addTrackInProgress) {
      handleAddNewTrack()
    } else if (addCarInProgress) {
      handleAddNewCar()
    } else {
      handleAddOrEditLap()
    }
  }

  const buildLap = (): Lap => {
    const currTrack = tracks.find(
      (t) => t._id === (!addTrackInProgress ? trackId : newTrackId.current)
    )
    const currCar = cars.find(
      (c) => c._id === (!addCarInProgress ? carId : newCarId.current)
    )

    if (!currTrack || !currCar) {
      throw Error(
        'New track/car data not available to build lap ' +
          currTrack?.name +
          ' ' +
          currCar?.name
      )
    }

    // TODO Switch back to reading group values once groups enabled.
    return {
      _id: existingLap ? existingLap._id : '',
      groupId: '604d68c1fd8e9726c8f8dd8f', //!existingLap ? state?.group?._id : existingLap.groupId,
      group: 'DriftJockeys', //!existingLap ? state?.group?.name : existingLap.group,
      gameId: !existingLap ? state?.game?._id : existingLap.gameId,
      game: !existingLap ? state?.game?.name : existingLap.game,
      trackId: currTrack._id,
      track: currTrack.name,
      carId: currCar._id,
      car: currCar.name,
      driverId: driverId,
      driver: driverName,
      laptime: laptime,
      gearbox: gearbox,
      traction: traction,
      stability: stability,
      date: date,
      replay: replay,
      notes: !notes ? '' : notes.trim(),
    }
  }

  // TODO Switch back to reading group values once groups enabled.
  const handleAddNewTrack = () => {
    return (
      axios
        .post('/api/tracks', {
          groupId: '604d68c1fd8e9726c8f8dd8f', //!existingLap ? state?.group?._id : existingLap.groupId,
          gameId: state?.game?._id,
          game: state?.game?.name,
          name: newTrackName,
        })
        // Add newly created track to existing track list
        .then((res) => {
          newTrackId.current = res.data._id
          tracks.push(res.data)
        })
        .then(() => {
          if (addCarInProgress) {
            return handleAddNewCar()
          } else {
            return handleAddOrEditLap()
          }
        })
        .catch((err) => console.error('Error [Add Track]: ' + err))
    )
  }

  // TODO Switch back to reading group values once groups enabled.
  const handleAddNewCar = () => {
    return (
      axios
        .post('/api/cars', {
          groupId: '604d68c1fd8e9726c8f8dd8f', //!existingLap ? state?.group?._id : existingLap.groupId,
          gameId: state?.game?._id,
          game: state?.game?.name,
          name: newCarName,
        })
        // Add newly created car to existing car list
        .then((res) => {
          newCarId.current = res.data._id
          cars.push(res.data)
        })
        .then(() => handleAddOrEditLap())
        .catch((err) => console.error('Error [Add Car]: ' + err))
    )
  }

  const handleAddOrEditLap = () => {
    const lapToSave = buildLap()

    if (existingLap) {
      return editLap(lapToSave)
    } else {
      return addLap(lapToSave)
    }
  }

  const addLap = (lapToSave: Lap) => {
    return axios
      .post('/api/laps', lapToSave)
      .then((res) => {
        updateNewLapDefaults(res.data)

        router.push('/')
      })
      .catch((err) => {
        console.error('Error [Add Lap]: ' + err)
      })
  }

  const editLap = (lapToSave: Lap) => {
    return axios
      .put('/api/laps/' + lapToSave._id, lapToSave)
      .then((res) => {
        router.push('/')
      })
      .catch((err) => {
        console.error('Error [Edit Lap]: ' + err)
      })
  }

  const updateNewLapDefaults = (newLap: Lap) => {
    let currentGameState = getGameState(state)

    currentGameState.newLapDefaultTrackId = newLap.trackId
    currentGameState.newLapDefaultCarId = newLap.carId
    currentGameState.newLapDefaultGearbox = gearbox
    currentGameState.newLapDefaultTraction = traction
    currentGameState.newLapDefaultStability = stability
    currentGameState.newLapDefaultNotes = notes

    setGameState(state, currentGameState)
  }

  const displayRecords = () =>
    !loading && !addTrackInProgress && !addCarInProgress && laptime

  const checkLapRecord = () => {
    return displayRecords() ? isLapRecord(laps, buildLap()) : false
  }

  const checkLapRecordForCar = () => {
    return displayRecords() ? isLapRecordForCar(laps, buildLap()) : false
  }

  const checkPersonalLapRecordForCar = () => {
    return displayRecords()
      ? isPersonalLapRecordForCar(laps, buildLap())
      : false
  }

  const handleGenerateSplitToFasterLap = () => {
    const split = displayRecords()
      ? generateSplitToFasterLap(laps, buildLap())
      : null

    if (!split || split === '00:00.000') {
      return null
    }

    return split
  }

  const handleGenerateSplitToSlowerLap = () => {
    const split = displayRecords()
      ? generateSplitToSlowerLap(laps, buildLap())
      : null

    if (!split || split === '00:00.000') {
      return null
    }

    return split
  }

  const displayExtraFeedback = () => {
    return (
      laptime.length === 9 &&
      laps.length > 0 &&
      (checkLapRecord() ||
        checkLapRecordForCar() ||
        checkPersonalLapRecordForCar() ||
        !!splitToFasterLap ||
        !!splitToSlowerLap)
    )
  }

  if (loading) {
    return <SkeletonAddEditLap />
  }

  return (
    <>
      <div className="ae-page">
        {existingLap ? (
          <h4 className="lap-title">Edit Lap</h4>
        ) : (
          <h4 className="lap-title">Add Lap</h4>
        )}
        <div className="ae-container">
          <div className="ae-form-container">
            <form onSubmit={onSubmit}>
              <div className="row mt-4">
                <div className={`col ${state?.showMobile ? 'pr-1' : 'pr-4'}`}>
                  <div className="form-group">
                    <label className="add-edit-label-with-button">Track</label>
                    {!addTrackInProgress ? (
                      <button
                        className="btn btn-sm btn-secondary add-track-car"
                        type="button"
                        onClick={onClickAddTrack}
                        disabled={addTrackInProgress}
                      >
                        Add Track
                      </button>
                    ) : (
                      <button
                        className="add-track-car pr-0 btn btn-link"
                        onClick={onClickCancelAddTrack}
                      >
                        Cancel
                      </button>
                    )}
                    {!addTrackInProgress ? (
                      <select
                        className="form-control"
                        required
                        value={trackId}
                        onChange={onChangeTrack}
                      >
                        {tracks.map((currTrack) => {
                          return (
                            <option key={currTrack._id} value={currTrack._id}>
                              {currTrack.name}
                            </option>
                          )
                        })}
                      </select>
                    ) : (
                      <input
                        className="form-control"
                        type="text"
                        required
                        value={newTrackName}
                        onChange={onChangeNewTrackName}
                        placeholder="Enter New Track Name"
                      />
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="add-edit-label-with-button">Car</label>
                    {!addCarInProgress ? (
                      <button
                        className="btn btn-sm btn-secondary add-track-car"
                        type="button"
                        onClick={onClickAddCar}
                        disabled={addCarInProgress}
                      >
                        Add Car
                      </button>
                    ) : (
                      <button
                        className="add-track-car pr-0 btn btn-link"
                        onClick={onClickCancelAddCar}
                      >
                        Cancel
                      </button>
                    )}
                    {!addCarInProgress ? (
                      <select
                        className="form-control"
                        required
                        value={carId}
                        onChange={onChangeCar}
                      >
                        {cars.map((currCar) => {
                          return (
                            <option key={currCar._id} value={currCar._id}>
                              {currCar.name}
                            </option>
                          )
                        })}
                      </select>
                    ) : (
                      <input
                        className="form-control"
                        type="text"
                        required
                        value={newCarName}
                        onChange={onChangeNewCarName}
                        placeholder="Enter New Car Name"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt-0">
                <div className={`col ${state?.showMobile ? 'pr-0' : 'pr-4'}`}>
                  <div className="form-group">
                    <label className="add-edit-label">Laptime</label>
                    <input
                      className="form-control"
                      type="text"
                      required
                      minLength={9}
                      maxLength={9}
                      pattern="\d{2}:\d{2}\.\d{3}"
                      value={laptime}
                      onChange={onChangeLaptime}
                      placeholder="00:00.000"
                    />
                    <small className="text-muted laptime-format">
                      {laptime && laptime.length > 0 && laptime.length < 9 ? (
                        <span>Format: 00:00.000</span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </small>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="add-edit-label">Driver</label>
                    <input
                      className="form-control driver-input"
                      required
                      value={driverName}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-0">
                <div className={`col ${state?.showMobile ? 'mr-1 pr-0' : 'mr-3 pr-2'}`}>
                  <div className="form-group">
                    <label className="add-edit-label">Gearbox</label>
                    <select
                      className="form-control"
                      required
                      value={gearbox}
                      onChange={onChangeGearbox}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>
                <div className={`col ${state?.showMobile ? 'mr-1 pr-0' : 'mr-3 pr-2'}`}>
                  <div className="form-group">
                    <label className="add-edit-label">Traction</label>
                    <select
                      className="form-control"
                      required
                      value={traction}
                      onChange={onChangeTraction}
                    >
                      <option value="Factory">Factory</option>
                      <option value="On">On</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="add-edit-label">Stability</label>
                    <select
                      className="form-control"
                      required
                      value={stability}
                      onChange={onChangeStability}
                    >
                      <option value="Factory">Factory</option>
                      <option value="On">On</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-0 mr-0">
                <div className="col-4 add-edit-date">
                  <div className="form-group">
                    <label className="add-edit-label">Date</label>
                    <div>
                      <DatePicker
                        selected={date}
                        onChange={onChangeDate}
                        dateFormat="dd/MM/yy"
                      />
                    </div>
                  </div>
                </div>
                <div className={`col-8 ${state?.showMobile ? 'pl-0' : 'pl-4'} pr-0`}>
                  <div className="form-group">
                    <label className="add-edit-label">Replay</label>
                    <input
                      className="form-control"
                      type="text"
                      value={replay}
                      onChange={onChangeReplay}
                      placeholder="Enter URL of uploaded lap replay - Eg. Youtube"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-0 mr-0">
                <div className="col-12 pr-0">
                  <div className="form-group">
                    <label className="add-edit-label">Notes</label>
                    <input
                      className="form-control"
                      type="text"
                      value={notes}
                      onChange={onChangeNotes}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mt-2 add-edit-button">
                <input
                  className="btn btn-primary mr-4"
                  type="submit"
                  disabled={submitClicked}
                  value={existingLap ? 'Update Lap' : 'Add New Lap'}
                />
                <Link href="/">Cancel</Link>
              </div>
            </form>
          </div>
          <div
            className={
              'ae-feedback-container' +
              (displayExtraFeedback() ? ' extraFeedbackIncluded' : '')
            }
          >
            <div className="feedback-banner">
              <h1 className="title-line-1">Hit the Track.</h1>
              <h1 className="title-line-2">Make History</h1>
            </div>
            <div className="feedback-extra">
              {laptime.length === 9 &&
                laps.length > 0 &&
                (checkLapRecord() ||
                  checkLapRecordForCar() ||
                  checkPersonalLapRecordForCar()) && (
                  <div>
                    {checkLapRecord() && (
                      <>
                        <span className="lap-record">Track record</span>
                        <span> across all cars</span>
                      </>
                    )}
                    {checkLapRecordForCar() && (
                      <>
                        <span className="lap-record-for-car">Track record</span>
                        <span> for the {carName}</span>
                      </>
                    )}
                    {checkPersonalLapRecordForCar() && (
                      <>
                        <span className="personal-lap-record-for-car">
                          Personal best
                        </span>
                        <span>
                          {' '}
                          lap for {driverName} in the {carName}
                        </span>
                      </>
                    )}
                  </div>
                )}
              {laptime.length === 9 && laps.length > 0 && splitToFasterLap && (
                <div>
                  <span>Keep it up! Only </span>
                  <span>
                    <strong>{splitToFasterLap}</strong>
                  </span>
                  <span> to reach the best lap</span>
                </div>
              )}
              {laptime.length === 9 && laps.length > 0 && splitToSlowerLap && (
                <div>
                  <span>Congratulations! </span>
                  <span>
                    <strong>{splitToSlowerLap}</strong>
                  </span>
                  <span> ahead of the next best lap</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddEditLap
