import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const ClientSideRender: React.FC<Props> = ({ children }) => {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return isClientSide ? <>{children}</> : null;
};

export default ClientSideRender;
