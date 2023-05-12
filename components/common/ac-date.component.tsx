import React from 'react';
import { format } from 'date-fns';

type AcDateProps = {
  date: Date;
};

const AcDate = (props: AcDateProps) => {
  const formatDate = () => {
    return format(new Date(props.date), 'dd/MM/yy');
  };

  return <span>{formatDate()}</span>;
};

export default AcDate;
