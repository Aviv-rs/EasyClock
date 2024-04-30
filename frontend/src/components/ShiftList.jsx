import React, { useState } from 'react';
import '../styles/components.scss'; // Import the SCSS file for styling
import EditShiftModal from './EditShiftModal';

const ShiftList = ({ shifts, updateShifts }) => {
  const [currShiftInEdit, setCurrShiftInEdit] = useState(null);

  const editShift = (shift) => {
    setCurrShiftInEdit(shift);
  }  

  return (
    <div className="shift_list">
      <h2>My past shifts</h2>
      <div className="shift_table">
        <div className="shift_row shift_heading">
          <div className="start_date">Date</div>
          <div className="start_time">Shift started</div>
          <div className="end_time">Shift ended</div>
        </div>
        {shifts.map((shift) => (
          <div key={shift.id} className="shift_row">
            <div className="start_date">{shift.dateStarted}</div>
            <div className="start_time">{shift.timeStartedParsed}</div>
            <div className="end_time">{shift.timeEndedParsed}</div>
            <button onClick={()=>editShift(shift)} className="btn_edit_shift clean_btn">✏️</button>
          </div>
        ))}
      </div>
      {currShiftInEdit && <EditShiftModal updateShifts={updateShifts} setIsModalOpen={setCurrShiftInEdit} shift={currShiftInEdit}/>}
    </div>
  );
};

export default ShiftList;
