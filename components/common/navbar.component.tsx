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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  // Reload groups when triggered from admin panel
  useEffect(() => {
    if (state?.driver && state.refreshGroups > 0) {
      initGroups(state.driver.groupIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.refreshGroups])

  // Reload games when triggered from admin panel
  useEffect(() => {
    if (state?.group && state.refreshGames > 0) {
      initGames(state.group._id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.refreshGames])

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
      // Minimum width at which desktop lap actions no longer display
      if (window.innerWidth < 992) {
        state?.setShowMobile(true)
      } else {
        state?.setShowMobile(false)
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

    state?.setGame(selectedGame)

    setAcTrackerState({ ...getAcTrackerState(), game: selectedGame })
  }

  const logout = async () => {
    await signOut()

    state?.setDriver(null)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
    }

    router.events?.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

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

      {/* Desktop navigation - hidden on mobile */}
      <div className="banner-right desktop-nav">
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

      {/* Hamburger menu button - visible only on mobile */}
      <button
        className="hamburger-btn"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-content">
              {/* Game Select */}
              <div className="mobile-menu-item">
                <label className="mobile-menu-label">Game</label>
                <select
                  className="mobile-game-select"
                  onChange={(e) => {
                    onChangeGame(e)
                    closeMenu()
                  }}
                  value={state?.game?._id}
                >
                  {!!games &&
                    games.map((game: Game) => {
                      return (
                        <option key={game._id} value={game._id}>
                          {game.name}
                        </option>
                      )
                    })}
                </select>
              </div>

              {/* Group Select */}
              <div className="mobile-menu-item">
                <label className="mobile-menu-label">Group</label>
                <select
                  className="mobile-group-select"
                  onChange={(e) => {
                    onChangeGroup(e)
                    closeMenu()
                  }}
                  value={state?.group?._id}
                >
                  {!!groups &&
                    groups.map((group: Group) => {
                      return (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      )
                    })}
                </select>
              </div>

              {/* Admin Button */}
              {!!state && state?.driver?.isAdmin && (
                <button
                  className="mobile-menu-btn admin-btn"
                  onClick={() => {
                    openAdmin()
                    closeMenu()
                  }}
                >
                  <Image
                    src={adminImg}
                    alt="admin"
                    className="mobile-menu-icon"
                    priority
                  />
                  <span>Admin</span>
                </button>
              )}

              {/* Logout Button */}
              <button className="mobile-menu-btn logout-btn" onClick={logout}>
                <Image
                  src={logoutImg}
                  alt="logout"
                  className="mobile-menu-icon"
                  priority
                />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
