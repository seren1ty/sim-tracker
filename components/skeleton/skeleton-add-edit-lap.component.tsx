import React from 'react';

const SkeletonAddEditLap = () => {
  return (
    <div className="ae-container">
      <div className="ae-form-container">
        <div className="skeleton-ae-form">
          {/* Track and Car row */}
          <div className="skeleton-ae-row">
            <div className="skeleton-ae-input"></div>
            <div className="skeleton-ae-input"></div>
          </div>

          {/* Laptime and Driver row */}
          <div className="skeleton-ae-row">
            <div className="skeleton-ae-input"></div>
            <div className="skeleton-ae-input"></div>
          </div>

          {/* Gearbox, Traction, Stability row */}
          <div className="skeleton-ae-row">
            <div className="skeleton-ae-input"></div>
            <div className="skeleton-ae-input"></div>
            <div className="skeleton-ae-input"></div>
          </div>

          {/* Date and Replay row */}
          <div className="skeleton-ae-row">
            <div className="skeleton-ae-input"></div>
            <div className="skeleton-ae-input"></div>
          </div>

          {/* Notes row */}
          <div className="skeleton-ae-row">
            <div className="skeleton-ae-input"></div>
          </div>

          {/* Button row */}
          <div className="skeleton-ae-button"></div>
        </div>
      </div>
      <div className="ae-feedback-container skeleton-ae-feedback-container">
        <div className="feedback-banner">
          <h1 className="title-line-1">Hit the Track.</h1>
          <h1 className="title-line-2">Make History</h1>
        </div>
      </div>
    </div>
  );
};

export default SkeletonAddEditLap;
