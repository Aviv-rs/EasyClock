import React, { useEffect, useState } from 'react';
import '../styles/components.scss'; // Import the SCSS file for styling
import EditShiftModal from './EditShiftModal';
import { utilService } from '../services/utilService';

const localUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

const AdminShiftList = () => {
  const [currShiftInEdit, setCurrShiftInEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const editShift = (shift) => {
    setCurrShiftInEdit(shift);
  };

  const handleUserSelect = ({ target }) => {
    setSelectedUserId(()=>target.value);
  };

  const updateShifts = (updatedShift) =>{
    setShifts((oldShifts)=>oldShifts.map((shift)=>{
        if(shift.id === updatedShift.id) return updatedShift;
        return shift;
    }));
  }  
  
  const fetchUsers = async () => {
      try {
        const fetchedUsers = await utilService.ajax('user/getAll');
        setUsers(()=>fetchedUsers);
        setSelectedUserId(()=>fetchedUsers[0].id);
      } catch (error) {
        alert('Error, could not get list of users');
      }
  };

  const getUserShifts = async (userId) =>{
    if(!userId) return;
    let userShifts = await utilService.ajax('shift/getUserShiftsById', 'POST', {userId});
    
    setShifts(()=>userShifts);
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    getUserShifts(selectedUserId);
  }, [selectedUserId]);
  

  return (
    <div className="shift_list">
      <h2>Welcome to the shifts dashboard, admin</h2>
      <div className="user_select">
        <span>Selected user shifts: </span>
        {users && users.length > 0 && <select onChange={handleUserSelect} name="user_select" id="user_select">
          {users.map((user)=>{
            return <option style={user.id === localUser.id ? {color: 'red'} : {}} key={user.id} value={user.id}>{user.id === localUser.id ? 'My shifts' : user.name}</option>
          })}
        </select>}
      </div>
      <div className="shift_table">
        <div className="shift_row shift_heading">
          <div className="start_date">Date</div>
          <div className="start_time">Shift started</div>
          <div className="end_time">Shift ended</div>
        </div>
        {shifts && shifts.length > 0 && shifts.map((shift) => (
          <div key={shift.id} className="shift_row">
            <div className="start_date">{shift.dateStarted}</div>
            <div className="start_time">{shift.timeStartedParsed}</div>
            <div className="end_time">{shift.timeEndedParsed}</div>
            <button onClick={()=>editShift(shift)} className="btn_edit_shift clean_btn">✏️</button>
          </div>
        ))}
      </div>
      {currShiftInEdit && <EditShiftModal userId={selectedUserId} updateShifts={updateShifts} setIsModalOpen={setCurrShiftInEdit} shift={currShiftInEdit}/>}
    </div>
  );
};

export default AdminShiftList;
