import React, { useState, useEffect, useContext } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import { StateContext } from '@/context/state.context'
import AdminDataAdd from './admin/admin-data-add.component'
import AdminDataAddDriver from './admin/admin-data-add-driver.component'
import AdminDataAddGroup from './admin/admin-data-add-group.component'
import AdminDataBoxes from './admin/admin-data-boxes.component'
import { Car, Driver, Game, Group, NewDriver, NewGroup, Track } from '@/types'
import Image from 'next/image'
import addIconImg from '@/public/add_blue.png'

const Admin = () => {
  const state = useContext(StateContext)

  const { data: session } = useSession()

  const [dataType, setDataType] = useState('Tracks')
  const [showAdd, setShowAdd] = useState(false)

  const [tracks, setTracks] = useState<Track[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    if (dataType === 'Tracks') {
      loadTracks()
    } else if (dataType === 'Cars') {
      loadCars()
    } else if (dataType === 'Drivers') {
      loadDrivers()
    } else if (dataType === 'Games') {
      loadGames()
    } else if (dataType === 'Groups') {
      loadGroups()
    }
    // eslint-disable-next-line
  }, [state?.game, dataType])

  const loadTracks = () => {
    if (!session || !session.user || !state) {
      return
    }

    state.setLoading(true)

    axios
      .get(`/api/tracks/game/${state.game?._id}/lap-check`)
      .then((res) => {
        setTracks(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state.setLoading(false)
      })
  }

  const loadCars = () => {
    if (!session || !session.user || !state) {
      return
    }

    state.setLoading(true)

    axios
      .get(`/api/cars/game/${state.game?._id}/lap-check`)
      .then((res) => {
        setCars(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state.setLoading(false)
      })
  }

  const loadDrivers = () => {
    if (!session || !session.user || !state) {
      return
    }

    state.setLoading(true)

    axios
      .get('/api/drivers/lap-check')
      .then((res) => {
        setDrivers(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state.setLoading(false)
      })
  }

  const loadGames = () => {
    if (!session || !session.user || !state) {
      return
    }

    state.setLoading(true)
    axios
      .get('/api/games/lap-check')
      .then((res) => {
        setGames(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state.setLoading(false)
      })
  }

  const loadGroups = () => {
    if (!session || !session.user || !state) {
      return
    }

    state.setLoading(true)

    axios
      .get('/api/groups')
      .then((res) => {
        setGroups(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state.setLoading(false)
      })
  }

  const onChangeDataType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDataType(event.target.value)

    setShowAdd(false)
  }

  const calculateTotal = () => {
    if (dataType === 'Tracks') return tracks.length
    else if (dataType === 'Cars') return cars.length
    else if (dataType === 'Drivers') return drivers.length
    else if (dataType === 'Games') return games.length
    else if (dataType === 'Groups') return groups.length
  }

  const onClickAdd = () => {
    setShowAdd(true)
  }

  const handleAdd = async (newName: string) => {
    if (dataType === 'Tracks') {
      // TODO Pass groupId/gameId to create
      const result = await performAdd('track', {
        game: state?.game,
        name: newName,
      })

      if (!result) return

      const newTracks = [
        ...tracks,
        {
          _id: result._id,
          groupId: state?.group?._id || '',
          gameId: state?.game?._id || '',
          game: result.game,
          name: result.name,
        },
      ]

      newTracks.sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      })

      setTracks(newTracks)
    } else if (dataType === 'Cars') {
      // TODO Pass groupId/gameId to create
      const result = await performAdd('car', {
        game: state?.game,
        name: newName,
      })

      if (!result) return

      const newCars = [
        ...cars,
        {
          _id: result._id,
          groupId: state?.group?._id || '',
          gameId: state?.game?._id || '',
          game: result.game,
          name: result.name,
        },
      ]

      newCars.sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      })

      setCars(newCars)
    } else if (dataType === 'Games') {
      const newCode = determineGameCode(newName)
      // TODO Pass groupId/gameId to create
      const result = await performAdd('game', { name: newName, code: newCode })

      if (!result) return

      const newGames = [
        ...games,
        {
          _id: result._id,
          groupId: state?.group?._id || '',
          name: result.name,
          code: result.code,
        },
      ]

      newGames.sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      })

      setGames(newGames)
    }
  }

  // TODO Pass groupId/gameId to create
  const handleAddDriver = async (newDriver: NewDriver) => {
    console.log(newDriver)

    if (dataType === 'Drivers') {
      const result = await performAdd('driver', {
        name: newDriver.name,
        email: newDriver.email,
      })

      if (!result) return

      const newDrivers = [
        ...drivers,
        {
          _id: result._id,
          groupId: state?.group?._id || '',
          name: result.name,
          isAdmin: false,
        },
      ]

      newDrivers.sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      })

      setDrivers(newDrivers)
    }
  }

  // TODO Pass groupId/gameId to create
  const handleAddGroup = async (newGroup: NewGroup) => {
    console.log(newGroup)

    if (dataType === 'Groups') {
      const result = await performAdd('group', {
        name: newGroup.name,
        code: newGroup.code,
        description: newGroup.description,
        ownerId: newGroup.ownerId,
      })

      if (!result) return

      const newGroups = [
        ...groups,
        {
          _id: result._id,
          name: result.name,
          code: result.code,
          description: result.description,
          ownerId: result.ownerId,
          driverIds: [],
        },
      ]

      newGroups.sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      })

      setGroups(newGroups)
    }
  }

  const determineGameCode = (name: string): string => {
    const words = name.split(' ')

    let code = ''

    words.forEach((word) => (code = code + word[0]))

    return code
  }

  const cancelAdd = () => {
    setShowAdd(false)
  }

  const performAdd = (cmdType: string, request: any) => {
    return axios
      .post('/api/' + cmdType + 's', request)
      .then((result) => {
        setShowAdd(false)

        return result.data
      })
      .catch((err) => console.error('Error [Add ' + cmdType + ']: ' + err))
  }

  const updateTrack = (newTrack: Track) => {
    console.log(newTrack)
  }

  const updateCar = (newCar: Car) => {
    console.log(newCar)
  }

  const updateDriver = (newDriver: Driver) => {
    console.log(newDriver)
  }

  const updateGame = (newGame: Game) => {
    console.log(newGame)
  }

  const updateGroup = (newGroup: Group) => {
    console.log(newGroup)
  }

  const deleteTrack = (track: Track, index: number) => {
    if (track.hasLaps) return

    state?.setLoading(true)

    axios
      .delete('/api/tracks/' + track._id)
      .then((res) => {
        const updatedTracks = tracks.filter(
          (currTrack: Track) => currTrack._id !== res.data._id
        )

        setTracks(updatedTracks)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state?.setLoading(false)
      })
  }

  const deleteCar = (car: Car, index: number) => {
    if (car.hasLaps) return

    state?.setLoading(true)

    axios
      .delete('/api/cars/' + car._id)
      .then((res) => {
        const updatedCars = cars.filter(
          (currCar: Car) => currCar._id !== res.data._id
        )

        setCars(updatedCars)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state?.setLoading(false)
      })
  }

  const deleteDriver = (driver: Driver, index: number) => {
    if (driver.hasLaps) return

    state?.setLoading(true)

    axios
      .delete('/api/drivers/' + driver._id)
      .then((res) => {
        const updatedDrivers = drivers.filter(
          (currDriver: Driver) => currDriver._id !== res.data._id
        )

        setDrivers(updatedDrivers)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state?.setLoading(false)
      })
  }

  const deleteGame = (game: Game, index: number) => {
    if (game.hasLaps) return

    state?.setLoading(true)

    axios
      .delete('/api/games/' + game._id)
      .then((res) => {
        const updatedGames = games.filter(
          (currGame: Game) => currGame._id !== res.data._id
        )

        setGames(updatedGames)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state?.setLoading(false)
      })
  }

  const deleteGroup = (group: Group, index: number) => {
    state?.setLoading(true)

    axios
      .delete('/api/groups/' + group._id)
      .then((res) => {
        const updatedGroups = groups.filter(
          (currGroup: Group) => currGroup._id !== res.data._id
        )

        setGroups(updatedGroups)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state?.setLoading(false)
      })
  }

  return (
    <>
      <div className="admin-page">
        <div className="admin-title-row">
          <span className="admin-title">Manage Data</span>
          <span className="admin-select-container">
            <select className="admin-select" onChange={onChangeDataType}>
              <option value="Tracks">Tracks</option>
              <option value="Cars">Cars</option>
              <option value="Drivers">Drivers</option>
              <option value="Games">Games</option>
              <option value="Groups">Groups</option>
            </select>
          </span>
          <span className="add-data-container">
            <button
              className="add-data-btn"
              data-tooltip-content="Add"
              data-tooltip-id="add"
              onClick={onClickAdd}
            >
              <Image
                src={addIconImg}
                alt="add-icon"
                className="add-icon"
                priority
              />
            </button>
            <Tooltip id="add" place="right" />
          </span>
          <span className="admin-total">
            <span className="sub-item">Total: </span>
            <span>
              <strong>{calculateTotal()}</strong>
            </span>
          </span>
        </div>
        {state?.loading && (
          <div className="mt-2 ml-2">
            <strong>Loading data...</strong>
          </div>
        )}
        {!state?.loading && (
          <div className="data-container">
            {!!showAdd && dataType !== 'Drivers' && dataType !== 'Groups' && (
              <AdminDataAdd onSave={handleAdd} onCancel={cancelAdd} />
            )}
            {!!showAdd && dataType === 'Drivers' && (
              <AdminDataAddDriver
                onSave={handleAddDriver}
                onCancel={cancelAdd}
              />
            )}
            {!!showAdd && dataType === 'Groups' && (
              <AdminDataAddGroup onSave={handleAddGroup} onCancel={cancelAdd} />
            )}
            {dataType === 'Tracks' && (
              <AdminDataBoxes
                data={tracks}
                onUpdate={updateTrack}
                onDelete={deleteTrack}
                showAdd={showAdd}
              />
            )}
            {dataType === 'Cars' && (
              <AdminDataBoxes
                data={cars}
                onUpdate={updateCar}
                onDelete={deleteCar}
                showAdd={showAdd}
              />
            )}
            {dataType === 'Drivers' && (
              <AdminDataBoxes
                data={drivers}
                onUpdate={updateDriver}
                onDelete={deleteDriver}
                showAdd={showAdd}
              />
            )}
            {dataType === 'Games' && (
              <AdminDataBoxes
                data={games}
                onUpdate={updateGame}
                onDelete={deleteGame}
                showAdd={showAdd}
              />
            )}
            {dataType === 'Groups' && (
              <AdminDataBoxes
                data={groups}
                onUpdate={updateGroup}
                onDelete={deleteGroup}
                showAdd={showAdd}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Admin
