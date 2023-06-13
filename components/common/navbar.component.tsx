import React, { useContext, useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import { StateContext } from '@/context/state.context'
import { getAcTrackerState, setAcTrackerState } from '@/utils/ac-localStorage'
import { Game, Group } from '@/types'
import Image from 'next/image'
import logoutImg from '@/public/logout_blue.png'
import adminImg from '@/public/settings_blue.png'
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const state = useContext(StateContext)

  const [groups, setGroups] = useState<Group[] | null>(null)
  const [games, setGames] = useState<Game[] | null>(null)

  // const [group, setGroup] = useState(() => {
  //   return state?.group
  //     ? state.group
  //     : // TODO Remove and init without hardcoded server value
  //       {
  //         _id: '604d68c1fd8e9726c8f8dd8f',
  //         name: 'DriftJockeys',
  //         code: 'DJ',
  //         ownerId: '5f90064a452b8f9c34a1ea3d',
  //         driverIds: [
  //           '5f90064a452b8f9c34a1ea3d',
  //           '5f90065e452b8f9c34a1ea3e',
  //           '5f900668452b8f9c34a1ea3f',
  //         ],
  //       }
  // })

  // const [game, setGame] = useState(() => {
  //   return state?.game
  //     ? state.game
  //     : // TODO Remove and init without hardcoded server value
  //       { _id: '5ff02ceaeff1fa286892c01a', name: 'Assetto Corsa', code: 'AC' }
  // })

  useEffect(() => {
    if (state?.driver) {
      initGroups(state?.driver?.groupIds)

      // Backup check for mobile blocking initial request
      setTimeout(() => {
        if (!state?.driver) {
          return
        }

        if (!groups) {
          initGroups(state.driver.groupIds)
        }
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.driver])

  useEffect(() => {
    if (state?.group) {
      initGames(state?.group._id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.group])

  const initGroups = (groupIds: string[]) => {
    if (!session || !session.user) {
      return
    }

    axios
      .get('/api/groups/' + groupIds)
      .then((res) => {
        setGroups(res.data)

        if (!state?.group && !!res.data.length) {
          state?.setGroup(res.data[0])
          return res.data[0]
        } else if (state?.group) {
          initGames(state?.group._id)
        }
      })
      //.then((group: Group) => initGames(group._id))
      .catch((err) => {
        console.error(err)
      })
  }

  const initGames = (groupId: string) => {
    if (!session || !session.user) {
      return
    }

    axios
      .get('/api/games/group/' + groupId)
      .then((res) => {
        setGames(res.data)

        if (!res.data.length) {
          state?.setGame(null)
        }

        if (!state?.game) {
          state?.setGame(res.data[0])
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 390) {
        state?.setShowMobile(true)
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openAdmin = () => {
    router.push('/admin')
  }

  const onChangeGroup = (groupEvent: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroup = groups?.find((g) => g._id === groupEvent.target.value)

    if (!selectedGroup) {
      return
    }

    //setGroup(selectedGroup)

    state?.setGroup(selectedGroup)

    setAcTrackerState({
      ...getAcTrackerState(),
      group: selectedGroup,
    })
  }

  const onChangeGame = (gameEvent: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGame = games?.find((g) => g._id === gameEvent.target.value)

    if (!selectedGame) {
      return
    }

    //setGame(selectedGame)

    state?.setGame(selectedGame)

    setAcTrackerState({ ...getAcTrackerState(), game: selectedGame })
  }

  const logout = async () => {
    await signOut()

    state?.setDriver(null)
  }

  if (router.pathname.startsWith('/login')) {
    return (
      <nav className="banner simple">
        <span className="nav-title">SimTracker</span>
      </nav>
    )
  }

  return (
    <nav className="banner">
      <div>
        <Link className="nav-title" href="/">
          SimTracker
        </Link>
      </div>
      <div className="banner-right">
        {!!state && state?.driver?.isAdmin && (
          <span>
            <button
              className="nav-link nav-item btn btn-link"
              data-tooltip-id="admin"
              data-tooltip-content="Admin"
              onClick={openAdmin}
            >
              <Image
                src={adminImg}
                alt="admin"
                className="settings-icon"
                priority
              />
            </button>
            <Tooltip id="admin" place="left" />
          </span>
        )}

        <span>
          <select
            className="game-select"
            onChange={onChangeGame}
            value={state?.game?._id}
          >
            {!!games &&
              games.map((game: Game) => {
                return (
                  <option key={game._id} value={game._id}>
                    {state?.showMobile ? game.code : game.name}
                  </option>
                )
              })}
          </select>
        </span>

        <span>
          <select
            className="group-select"
            onChange={onChangeGroup}
            value={state?.group?._id}
          >
            {!!groups &&
              groups.map((group: Group) => {
                return (
                  <option key={group._id} value={group._id}>
                    {state?.showMobile ? group.code : group.name}
                  </option>
                )
              })}
          </select>
        </span>

        <span>
          <button
            className="nav-link nav-item btn btn-link logout-btn"
            data-tooltip-id="logout"
            data-tooltip-content="Logout"
            onClick={logout}
          >
            <Image
              src={logoutImg}
              alt="logout"
              className="logout-icon"
              priority
            />
          </button>
          <Tooltip id="logout" place="left" />
        </span>
      </div>
    </nav>
  )
}

export default Navbar
