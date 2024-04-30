import { useState, useEffect } from 'react';
import { utilService } from '../services/utilService';

const ShiftBtn = ({updateShifts}) => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currShift, setCurrShift] = useState(null);

  const getTimeFromAPI = async () =>{
    let timeData = await fetch('http://worldtimeapi.org/api/timezone/Europe/Berlin');
    timeData = await timeData.json();

    return timeData;
  };

  const checkForActiveShift = async () => {
        try {
            const activeShift = await utilService.ajax('shift/getActive');
            if(activeShift && activeShift.id > 0){
                const shiftStartTime = new Date(activeShift.timeStarted).getTime();
                const now = new Date().getTime();
                const activeShiftElapsedTime = now - shiftStartTime;
                setElapsedTime(()=>activeShiftElapsedTime);
                setStartTime(now - activeShiftElapsedTime);
                setIsRunning(true);
                setCurrShift(()=>activeShift);
            }
        } catch (error) {
            alert('Error, could not get active shift');
        }
   };

   useEffect(() => {
        checkForActiveShift();
    }, []);
  

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {

        setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = async () => {
    if (isRunning) {
      handleShiftEnd();
    } else {
      const now = new Date().getTime();
      setStartTime(now - elapsedTime);
      setIsRunning(true);
      
      // save the new shift
      try {
          const { datetime: timeStarted } = await getTimeFromAPI();
          
          const newShift = await utilService.ajax('shift/start', 'POST', { timeStarted });
          setCurrShift(()=>newShift);
      } catch {
        alert('Failed to start shift! please contact the web master');

      }
      
    }
};

const handleShiftEnd = async () => {
    setStartTime(null);
    setElapsedTime(0);
    setIsRunning(false);

    try {
        const timeEnded = await getTimeFromAPI();
        const updatedShift = await utilService.ajax('shift/end', 'POST', { timeEnded: timeEnded.datetime, shiftId: currShift.id });
        setCurrShift(()=>updatedShift);
        updateShifts(updatedShift, true);

    } catch {
        alert('Failed to save shift! please contact the web master')
    }
  };


  return (
    <div className="shift_btn_wrapper">
      <button className={`${isRunning ? 'active' : ''} btn wide btn_toggle_shift`} onClick={handleStartStop}>
        <h2>{isRunning ? 'End shift' : 'Start a new shift'}</h2> 
        <div className="timer">{utilService.formatTime(isRunning ? new Date().getTime() - startTime : elapsedTime)}</div>
      </button>
    </div>
  );
};

export default ShiftBtn;
