import React from 'react';
import { Link } from 'react-router-dom';

const ProgramName = ({ value, designation }) => (
  <>
    <h5 className="font-size-14 mb-1">
      <Link to="#" className="text-dark">
        {value}
      </Link>
    </h5>
    <p className="text-muted mb-0">{designation}</p>
  </>
);

const ChildName = ({ value, designation }) => (
  <>
    <h5 className="font-size-14 mb-1">
      <Link to="#" className="text-dark">
        {value}
      </Link>
    </h5>
    <p className="text-muted mb-0">{designation}</p>
  </>
);

const level = ({ value }) => value || '';


const Day = ({ value }) => value || '';
const Time = ({ value }) => value || '';
const TimeOffset = ({ value }) => value || '';

export {
  ProgramName,
  ChildName,
  level,
  Time,
  Day,
  TimeOffset
};
