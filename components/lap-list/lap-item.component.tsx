import React, { useContext, useState, useEffect } from 'react';
import AcDate from '@/components/common/ac-date.component';
import Truncator from '@/components/common/truncator.component';
import { Tooltip } from 'react-tooltip';
import { StateContext } from '@/context/state.context';
import Laptime from '@/components/common/laptime.component';
import LapActions from './lap-actions.component';
import { HoveredLap, Lap } from '@/types';
import { getGameState } from '@/utils/ac-localStorage';
import Image from 'next/image';
import replayImg from '@/public/replay_blue.png';
import notesImg from '@/public/notes_blue.png';

type LapItemProps = {
  lap: Lap;
  hoveredLap: HoveredLap | null;
  isLapRecord: (currentLap: Lap) => boolean;
  isLapRecordForCar: (currentLap: Lap) => boolean;
  isPersonalLapRecordForCar: (currentLap: Lap) => boolean;
  deleteLap: (_id: string) => void;
  onHover: (hoveredLapData: HoveredLap | null) => void;
};

const LapItem = (props: LapItemProps) => {
  const [lap, setLap] = useState<Lap>(props.lap);
  const [isLapHovered, setIsLapHovered] = useState<boolean>(false);

  useEffect(() => {
    lap.isLapRecord = props.isLapRecord(lap);
    lap.isLapRecordForCar = props.isLapRecordForCar(lap);
    lap.isPersonalLapRecordForCar = props.isPersonalLapRecordForCar(lap);

    setLap({ ...lap });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLapHovered(!!props.hoveredLap);
    // eslint-disable-next-line
  }, [props.hoveredLap]);

  const state = useContext(StateContext);

  const highlightDriversLap = () => {
    return shownLapsAreNotLimitedToCurrentDriver() && lapIsForCurrentDriver();
  };

  const shownLapsAreNotLimitedToCurrentDriver = () => {
    return getGameState(state).driverType !== lap.driver;
  };

  const lapIsForCurrentDriver = () => {
    return !!state ? state.driver?.name === lap.driver : false;
  };

  const isLapDataHovered = (type: string, data: string) => {
    return (
      isLapHovered &&
      props.hoveredLap?.type === type &&
      props.hoveredLap?.data === data
    );
  };

  const enabledMobileReplay = () => {
    return lap.replay && state?.showMobile;
  };

  const onClickLapRow = () => {
    if (enabledMobileReplay()) {
      window.open(lap.replay);
    }
  };

  return (
    <tr
      className={'lap-row ' + (highlightDriversLap() ? 'drivers-lap' : '')}
      onClick={() => onClickLapRow()}
    >
      <td className={enabledMobileReplay() ? 'has-replay' : ''}>
        <span
          className={isLapDataHovered('Track', lap.track) ? 'text-strong' : ''}
          onMouseEnter={() =>
            props.onHover({ _id: lap._id, type: 'Track', data: lap.track })
          }
          onMouseLeave={() => props.onHover(null)}
        >
          <Truncator id={'track_' + lap._id} value={lap.track} max={20} />
        </span>
      </td>
      <td className="lap-car-cell">
        <span
          className={isLapDataHovered('Car', lap.car) ? 'text-strong' : ''}
          onMouseEnter={() =>
            props.onHover({ _id: lap._id, type: 'Car', data: lap.car })
          }
          onMouseLeave={() => props.onHover(null)}
        >
          <Truncator id={'car_' + lap._id} value={lap.car} max={25} />
        </span>
      </td>
      <td className="lap-replay-cell sub-item">
        {lap.replay && (
          <span>
            <a
              href={lap.replay}
              target="_"
              data-tooltip-content="Launch Replay"
              data-tooltip-id={'replay_' + lap._id}
            >
              <Image
                src={replayImg}
                alt="replay"
                className="lap-replay-icon"
                priority
              />
            </a>
            <Tooltip id={'replay_' + lap._id} place="left" />
          </span>
        )}
      </td>
      <td>
        <Laptime lap={lap} />
      </td>
      <td>{lap.driver}</td>
      <td className="sub-item">
        {lap.gearbox === 'Manual' ? 'Manual' : 'Auto'}
      </td>
      <td className="sub-item">{lap.traction}</td>
      <td className="sub-item">{lap.stability}</td>
      <td className="lap-date-cell">
        <AcDate date={lap.date} />
      </td>
      <td className="lap-notes-cell sub-item">
        {lap.notes && (
          <span>
            <span
              data-tooltip-content={lap.notes}
              data-tooltip-id={'notes_' + lap._id}
            >
              <Image
                src={notesImg}
                alt="notes"
                className="lap-notes-icon"
                priority
              />
            </span>
            <Tooltip id={'notes_' + lap._id} place="left" />
          </span>
        )}
      </td>
      <td className="lap-row-actions sub-item">
        <LapActions
          sessionDriver={state?.driver}
          lap={lap}
          deleteLap={props.deleteLap}
        />
      </td>
    </tr>
  );
};

export default LapItem;
