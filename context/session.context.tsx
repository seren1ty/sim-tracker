import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getAcTrackerState, setAcTrackerState } from '@/utils/ac-localStorage';
import { Session } from '@/types';

type ContextProps = {
  children: React.ReactNode;
};

const SessionContext = React.createContext<Session | null>(null);

const SessionProvider = ({ children }: ContextProps) => {
  const router = useRouter();

  const [showMobile, setShowMobile] = useState(false);

  const [loading, setLoading] = useState(false);

  const [group, setGroup] = useState(() => {
    return !!getAcTrackerState() ? getAcTrackerState().group : null;
  });

  const [game, setGame] = useState(() => {
    return !!getAcTrackerState() ? getAcTrackerState().game : null;
  });

  const [driver, setDriver] = useState(() => {
    return !!getAcTrackerState() ? getAcTrackerState().driver : null;
  });

  useEffect(() => {
    setAcTrackerState({ ...getAcTrackerState(), group: group });
  }, [group]);

  useEffect(() => {
    setAcTrackerState({ ...getAcTrackerState(), game: game });
  }, [game]);

  useEffect(() => {
    setAcTrackerState({ ...getAcTrackerState(), driver: driver });
  }, [driver]);

  const checkSession = () => {
    return axios
      .get('/session/status')
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.error('Session expired: ' + err);

        router.push('/login');
      });
  };

  return (
    <SessionContext.Provider
      value={{
        showMobile,
        loading,
        group,
        game,
        driver,
        setShowMobile,
        setLoading,
        setGroup,
        setGame,
        setDriver,
        checkSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
