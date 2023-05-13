import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getAcTrackerState, setAcTrackerState } from '@/utils/ac-localStorage';
import { State } from '@/types';

type ContextProps = {
  children: React.ReactNode;
};

const StateContext = React.createContext<State | null>(null);

const StateProvider = ({ children }: ContextProps) => {
  const { data: session } = useSession();

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

  useEffect(() => {
    if (!session || !session.user) {
      console.error('Session expired');
      router.push('/login');
    }
  }, [session]);

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
