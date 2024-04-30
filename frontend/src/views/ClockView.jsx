import { useEffect, useState } from "react";
import DigitalClock from "../components/DigitalClock";
import ShiftBtn from "../components/ShiftBtn";
import ShiftList from "../components/ShiftList";
import { utilService } from "../services/utilService";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminShiftList from "../components/AdminShiftList ";

const ClockView = () => {
        const [time, setTime] = useState(null);
        const [shifts, setShifts] = useState([]);

        const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
        const navigate = useNavigate();
      
        useEffect(() => {
          if(!isAuthenticated && !isLoading) return navigate('/');
          else if (isAuthenticated && !isLoading) {
              getTimeFromAPI();
              if(!isAdmin) getUserShifts(); // admin shifts are handled in the AdminShiftList component
          }
      
        }, [isAuthenticated, isLoading]);

        const getTimeFromAPI = async () =>{
            let timeData = await fetch('http://worldtimeapi.org/api/timezone/Europe/Berlin');
            timeData = await timeData.json();
            timeData.currTimeStr = timeData.datetime.substr(11, 8);
            
            setTime(()=>timeData);
        };

        const getUserShifts = async () =>{
            let userShifts = await utilService.ajax('shift/getUserShifts');
            
            setShifts(()=>userShifts);
        };

        const updateShifts = (updatedShift, isAdd = false) =>{
            setShifts((oldShifts)=>{
                if(isAdd) return [updatedShift, ...oldShifts];
                return oldShifts.map((shift)=>{
                    if(shift.id === updatedShift.id) return updatedShift;
                    return shift;
                })
            });
        }        

        return (
            <div id="clock_view" className="page">
                <div className="site_bg"></div>
                <div className="content centered" data-size="md">
                    {time && time.currTimeStr && <DigitalClock customHour={time.currTimeStr}/>}

                    <ShiftBtn updateShifts={updateShifts}/>
                    {isAdmin ? 
                    <AdminShiftList />
                    :
                    <ShiftList updateShifts={updateShifts} shifts={shifts}/>
                    }
                </div>
            </div>
        );
}

export default ClockView;