import { useState, useEffect } from 'react';

const DigitalClock = ({ customHour, customText = '' }) => {
  const [initialCustomTime, setInitialCustomTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (customHour !== undefined && initialCustomTime === null) {
      const [hour, minute, second] = customHour.split(':').map(str => parseInt(str, 10));
      const now = new Date();
      now.setHours(hour, minute, second);
      setInitialCustomTime(now);
    }

    const interval = setInterval(() => {
      setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [customHour, initialCustomTime]);

  const currentTime = initialCustomTime ? new Date(initialCustomTime.getTime() + elapsedTime) : new Date();

  const formattedTime = currentTime.toLocaleTimeString([], { hour12: false });

  return (
    <div className="digital_clock">
      <span>{customText} {formattedTime}</span>
    </div>
  );
};

export default DigitalClock;
