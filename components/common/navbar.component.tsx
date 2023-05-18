import React, { useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { StateContext } from '@/context/state.context';
import { getAcTrackerState, setAcTrackerState } from '@/utils/ac-localStorage';
import { Game, Group } from '@/types';
import Image from 'next/image';
import logoutImg from '@/public/logout_blue.png';
import adminImg from '@/public/settings_blue.png';
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const state = useContext(StateContext);

  const [groups, setGroups] = useState<Group[] | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);

  /* const [group, setGroup] = useState(() => {
        return session?.group ? session.group : undefined;
    }); */

  const [game, setGame] = useState(() => {
    return state?.game ? state.game : 'Assetto Corsa';
  });

  useEffect(() => {
    //initGroups();
    initGames();

    // Backup check for mobile blocking initial request
    setTimeout(() => {
      //if (!groups) initGroups();

      if (!games) initGames();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.driver]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 390) {
        state?.setShowMobile(true);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initGroups = () => {
    if (!session || !session.user) {
      return;
    }

    axios
      .get('/api/groups')
      .then((res) => {
        setGroups(res.data);

        if (!state?.group && !!res.data.length) {
          state?.setGroup(res.data[0].name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const initGames = () => {
    if (!session || !session.user) {
      return;
    }

    axios
      .get('/api/games')
      .then((res) => {
        setGames(res.data);

        if (!state?.game && !!res.data.length) {
          state?.setGame(res.data[0].name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const openAdmin = () => {
    router.push('/admin');
  };

  /* const onChangeGroup = (groupEvent: React.ChangeEvent<HTMLSelectElement>) => {
        setGroup(groupEvent.target.value);

        session?.setGroup(groupEvent.target.value);

        setAcTrackerState({ ...getAcTrackerState(), group: groupEvent.target.value });
    } */

  const onChangeGame = (gameEvent: React.ChangeEvent<HTMLSelectElement>) => {
    setGame(gameEvent.target.value);

    state?.setGame(gameEvent.target.value);

    setAcTrackerState({ ...getAcTrackerState(), game: gameEvent.target.value });
  };

  const logout = async () => {
    await signOut();

    state?.setDriver(null);
  };

  if (router.pathname.startsWith('/login')) {
    return (
      <nav className="banner simple">
        <span className="nav-title">SimTracker</span>
      </nav>
    );
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
          <select className="game-select" onChange={onChangeGame} value={game}>
            {!!games &&
              games.map((game: Game) => {
                return (
                  <option key={game._id} value={game.name}>
                    {state?.showMobile ? game.code : game.name}
                  </option>
                );
              })}
          </select>
        </span>
        {/* <span>
            <select className="game-select" onChange={onChangeGroup} value={group}>
            {
                !!groups &&
                groups.map((group: Group) => {
                    return <option key={group._id} value={group.name}>{ showMobile ? group.code : group.name }</option>
                })
            }
            </select>
          </span>
        */}
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
  );
};

export default Navbar;
