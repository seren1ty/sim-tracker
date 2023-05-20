import React from 'react';
import SkeletonLap from './skeleton-lap.component';
import SkeletonFilters from './skeleton-filters.component';

const SkeletonLaps = () => {
  return (
    <>
      <SkeletonFilters />
      <div className="skeleton-laps">
        <SkeletonLap />
        <SkeletonLap />
        <SkeletonLap />
        <SkeletonLap />
        <SkeletonLap />
        <SkeletonLap />
      </div>
    </>
  );
};

export default SkeletonLaps;
