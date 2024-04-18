import { useState, useEffect } from 'react';
import { utilService } from '../services/utilService';

const ShiftBtn = () => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currShift, setCurrShift] = useState(null);

  const getTimeFromAPI = async () =>{
    let timeData = await fetch('http://worldtimeapi.org/api/timezone/Europe/Berlin');
    timeData = await timeData.json();

    return timeData;
  };

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
        const updatedShift = utilService.ajax('shift/end', 'POST', { timeEnded: timeEnded.datetime, shiftId: currShift.id });
        setCurrShift(()=>updatedShift);

    } catch {
        alert('Failed to save shift! please contact the web master')
    }
  };


  return (
    <div className="shift-btn">
      <div className="timer">{utilService.formatTime(isRunning ? new Date().getTime() - startTime : elapsedTime)}</div>
      <button className='btn wide' onClick={handleStartStop}>{isRunning ? 'End shift' : 'Start a new shift'}</button>
    </div>
  );
};

export default ShiftBtn;
