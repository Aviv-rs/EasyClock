const userService = require('../../services/user.service');
const logger = require('../../services/logger.service');
const utilService = require('../../services/utilService');


async function getShiftParsed(shift) {
  try {
    
    if (!shift.id || !shift.timeStarted || !shift.timeEnded){
      logger.error('Error while getting parsed shift: Invalid shift fields');
      throw new Error('Invalid shift fields');
    }
    
    let shiftParsed = {...shift};
    shiftParsed.dateStarted = utilService.getFormattedDate(shiftParsed.timeStarted);
    shiftParsed.timeStartedParsed = shiftParsed.timeStarted.substr(11, 8);
    shiftParsed.timeEndedParsed = shiftParsed.timeEnded.substr(11, 8);

    return shiftParsed;
  } catch (err) {
    logger.error('Error while getting parsed shift:' + err);
    throw new Error(err.message);
    
  }
}

async function getUserShifts(userId, order = {}, filter = {}) {
  try {
    if (!userId){
      logger.error('Shift.service - error while getting user shifts: User ID not provided');
      throw new Error('User ID not provided');
    }
    
    let orderBy = {
      timeStarted: 'DESC'
    };
    
    let filterBy = {
      timeEnded: true // only fetch non active shifts
    };

    orderBy = {...orderBy, ...order};
    filterBy = {...filterBy, ...filter};
            
    const user = await userService.getById(userId);
        
    if(!user) throw new Error("Invalid user ID");

    let userShifts = await Promise.all(user.shifts.map(shift=>getShiftParsed(shift)));

    if(filterBy.timeEnded) {
      userShifts = userShifts.filter(shift=>shift.timeEnded);
    }

    if(orderBy.timeStarted) {
      userShifts = userShifts.sort((s1, s2)=> {
        return orderBy.timeStarted === 'DESC' ? utilService.compareDateTimeStrings(s2.timeStarted, s1.timeStarted) : utilService.compareDateTimeStrings(s1.timeStarted, s2.timeStarted);
      });
    }

    return userShifts;
  } catch (err) {
    logger.error('Error while getting user shifts' + err);
    throw new Error(err.message);
    
  }
}

module.exports = {
  getShiftParsed,
  getUserShifts
}
