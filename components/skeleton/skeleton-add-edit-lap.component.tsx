import React from 'react';

const SkeletonAddEditLap = () => {
  return (
    <>
      <div className="ae-page">
        <div className="skeleton-ae-title"></div>
        <div className="ae-container">
          <div className="ae-form-container">
            <div className="skeleton-ae-form">
              {/* Track and Car row */}
              <div className="skeleton-ae-row">
                <div className="skeleton-ae-field">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
                <div className="skeleton-ae-field sub-item">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
              </div>

              {/* Laptime and Driver row */}
              <div className="skeleton-ae-row">
                <div className="skeleton-ae-field">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
                <div className="skeleton-ae-field sub-item">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
              </div>

              {/* Gearbox, Traction, Stability row */}
              <div className="skeleton-ae-row sub-item">
                <div className="skeleton-ae-field-small">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
                <div className="skeleton-ae-field-small">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
                <div className="skeleton-ae-field-small">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
              </div>

              {/* Date and Replay row */}
              <div className="skeleton-ae-row sub-item">
                <div className="skeleton-ae-field-date">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
                <div className="skeleton-ae-field-replay">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
              </div>

              {/* Notes row */}
              <div className="skeleton-ae-row">
                <div className="skeleton-ae-field-full">
                  <div className="skeleton-ae-label"></div>
                  <div className="skeleton-ae-input"></div>
                </div>
              </div>

              {/* Button row */}
              <div className="skeleton-ae-button"></div>
            </div>
          </div>
          <div className="ae-feedback-container">
            <div className="feedback-banner">
              <h1 className="title-line-1">Hit the Track.</h1>
              <h1 className="title-line-2">Make History</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkeletonAddEditLap;
