import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getAcTrackerState, setAcTrackerState } from '@/utils/ac-localStorage';
import { State } from '@/types';
import axios from 'axios';

type ContextProps = {
  children: React.ReactNode;
};

const StateContext = React.createContext<State | null>(null);

const StateProvider = ({ children }: ContextProps) => {
  const { data: session, status } = useSession();

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

  // Detect end of session and redirect to login
  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading' && !session) {
      console.error('Session expired');
      router.push('/login');
    }
  }, [session]);

  // Detect new session redirect to main page
  useEffect(() => {
    (async () => {
      if (status === 'authenticated') {
        const res = await axios.get(
          '/api/drivers/email/' + session?.user?.email
        );
        setDriver(res.data);

        router.push('/');
      }
    })();
  }, [status]);

  return (
    <StateContext.Provider
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { StateContext, StateProvider };
