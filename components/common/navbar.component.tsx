import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { SessionContext } from '@/context/session.context';
import { getAcTrackerState, setAcTrackerState } from '@/utils/ac-localStorage';
import { Game, Group } from '@/types';
import Image from 'next/image';
import logoutImg from '@/public/logout_blue.png';

const Navbar = () => {
  const router = useRouter();

  const session = useContext(SessionContext);

  const [groups, setGroups] = useState<Group[] | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);

  /* const [group, setGroup] = useState(() => {
        return session?.group ? session.group : undefined;
    }); */

  const [game, setGame] = useState(() => {
    return session?.game ? session.game : 'Assetto Corsa';
  });

  useEffect(() => {
    initGroups();
    initGames();

    // Backup check for mobile blocking initial request
    setTimeout(() => {
      if (!groups) initGroups();

      if (!games) initGames();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.driver]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 390) {
        session?.setShowMobile(true);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initGroups = () => {
    if (!session) return;

    session.checkSession().then((success) => {
      if (!success) return;

      axios
        .get('/groups')
        .then((res) => {
          setGroups(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  const initGames = () => {
    if (!session) return;

    session.checkSession().then((success) => {
      if (!success) return;

      axios
        .get('/games')
        .then((res) => {
          setGames(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
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

    session?.setGame(gameEvent.target.value);

    setAcTrackerState({ ...getAcTrackerState(), game: gameEvent.target.value });
  };

  const logout = () => {
    axios.post('/session/logout').then(() => {
      session?.setDriver(null);

      router.push('/login');
    });
  };

  if (router.pathname.startsWith('/login')) {
    return (
      <nav className="banner simple">
        <span className="nav-title">AC Tracker</span>
      </nav>
    );
  }

  return (
    <nav className="banner">
      <div>
        <a className="nav-title" href="/">
          AC Tracker
        </a>
      </div>
      <div className="banner-right">
        {!!session && session?.driver?.isAdmin && (
          <span>
            <button
              className="nav-link nav-item btn btn-link"
              data-tip="Admin"
              data-for="admin"
              onClick={openAdmin}
            >
              <Image
                src="/settings_blue.png"
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
                    {session?.showMobile ? game.code : game.name}
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
            data-tip="Logout"
            data-for="logout"
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
