import React from 'react';
import '../styles/Grid.css';

const PatientTableCell = ({ children, hasAlarm, ...props }) => {
  return (
    <td 
      {...props}
      className={`patient-table-cell ${hasAlarm ? 'alarm-cell' : ''}`}
    >
      {children}
    </td>
  );
};

export default PatientTableCell;