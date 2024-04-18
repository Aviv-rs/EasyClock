import { useEffect, useRef } from 'react';
import { utilService } from '../services/utilService';


const EditShiftModal = ({ shift, setIsModalOpen, updateShifts}) => {
  
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutsideMenu = (ev) => {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            setIsModalOpen(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
        document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
}, [modalRef])

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget)

    const shiftDetails = {
      timeStarted: data.get('timeStarted'),
      timeEnded: data.get('timeEnded'),
    }

    const isValidShiftTimes = utilService.compareTimeStrings(shiftDetails.timeStarted, shiftDetails.timeEnded) === -1;

    if(!isValidShiftTimes) alert('Shift start time must be earlier than shift end time!');

    try {
      const updatedShift = await utilService.ajax('shift/edit', 'PUT', {...shiftDetails, shiftId: shift.id});
      updateShifts(updatedShift);
      setIsModalOpen(false);
    } catch (err){
      console.error(err);
    }

  };

  return (
    <div className="modal" id="edit_shift_modal">    
      <div id="edit_shift_form" ref={modalRef} className="container modal_content">
        <div className="form_container">
          <h2>Edit shift from {shift.dateStarted}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label htmlFor="timeStarted">Shift started: </label>
              <input type="time" required step="1" defaultValue={shift.timeStartedParsed} name="timeStarted" id="timeStarted"/>
            </div>
            <div className="form_group">
              <label htmlFor="timeStarted">Shift ended: </label>
              <input type="time" required step="1" defaultValue={shift.timeEndedParsed} name="timeEnded" id="timeEnded"/>
            </div>
            <button className="btn" type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShiftModal;