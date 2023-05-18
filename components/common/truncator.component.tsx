import React from 'react';
import { Tooltip } from 'react-tooltip';

type TruncatorProps = {
  id: string;
  value: string;
  max: number;
};

const Truncator = (props: TruncatorProps) => {
  const needsTruncating = () => {
    return props.value.length > props.max;
  };

  const truncate = () => {
    return props.value.substring(0, props.max) + '..';
  };

  return (
    <span>
      {needsTruncating() ? (
        <span>
          <span data-tooltip-content={props.value} data-tooltip-id={props.id}>
            {truncate()}
          </span>
          <Tooltip id={props.id} place="right" />
        </span>
      ) : (
        <span>{props.value}</span>
      )}
    </span>
  );
};

export default Truncator;
