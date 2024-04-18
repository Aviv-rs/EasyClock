const userService = require('../../services/user.service');
const logger = require('../../services/logger.service');
const utilService = require('../../services/utilService');

async function startShift(req, res) {
    try {
        const { timeStarted } = req.body;
        const { userId } = req;

        logger.debug('Trying to start new shift, user ID: ', userId, " time Started: ", timeStarted);
        if(!userId || !timeStarted) throw "userID or start time not provided!";
        
        const user = await userService.getById(userId);

        if(!user) throw "Invalid user ID";

        const shiftToAdd = {
            id: user.shifts.length + 1,
            timeStarted,
            timeEnded: null,
            userId,
        };

        user.shifts.push(shiftToAdd);

        userService.update(user.id, 'shifts', user.shifts);

        res.json(shiftToAdd);
    } catch (err) {
        logger.error('cannot start shift', err);
        res.status(500).send({ err: 'Failed to start shift' });

    }
}

async function endShift(req, res) {
    try {
        const { timeEnded, shiftId } = req.body;
        const { userId } = req;

        logger.debug('Trying to end shift, user ID: ', userId, " time Ended: ", timeEnded, " shift id: ", shiftId);
        if(!userId || !timeEnded || +shiftId < 1) throw "userID, shiftID or end time not provided!";
        
        
        const user = await userService.getById(userId);
        
        if(!user) throw "Invalid user ID";
        
        const shiftIdx = user.shifts.findIndex(shift=>shift.id === shiftId);

        if(shiftIdx === -1) throw "Shift not found, invalid shiftID";

        user.shifts[shiftIdx] = {...user.shifts[shiftIdx], timeEnded};

        userService.update(user.id, 'shifts', user.shifts);

        res.json(user.shifts[shiftIdx]);
    } catch (err) {
        logger.error('cannot end shift', err);
        res.status(500).send({ err: 'Failed to end shift' });

    }
}
async function editShift(req, res) {
    try {
        let { timeEnded, timeStarted, shiftId } = req.body;
        const { userId } = req;

        logger.debug('Trying to edit shift, user ID: ', userId, " time Started: ", timeStarted, " time Ended: ", timeEnded, " shift id: ", shiftId);
        if(!userId || !timeEnded || !timeStarted || +shiftId < 1) throw "userID, shiftID or end time not provided!";
        
        const isValidShiftTimes = utilService.compareTimeStrings(timeStarted, timeEnded);

        if(!isValidShiftTimes) throw "Invalid shift times!";

        const user = await userService.getById(userId);
        
        if(!user) throw "Invalid user ID";
        
        const shiftIdx = user.shifts.findIndex(shift=>shift.id === shiftId);

        if(shiftIdx === -1) throw "Shift not found, invalid shiftID";

        let shiftToUpdate = user.shifts[shiftIdx];
        const hourRegex = /\d{2}:\d{2}:\d{2}/;
        const timeStartedParsed = timeStarted;
        const timeEndedParsed = timeEnded;
        timeStarted = shiftToUpdate.timeStarted.replace(hourRegex, timeStarted);
        timeEnded = shiftToUpdate.timeEnded.replace(hourRegex, timeEnded);

        shiftToUpdate = {...user.shifts[shiftIdx], timeStarted, timeEnded};

        userService.update(user.id, 'shifts', user.shifts);

        res.json({...shiftToUpdate, timeStartedParsed, timeEndedParsed, dateStarted: utilService.getFormattedDate(timeStarted)});
    } catch (err) {
        logger.error('cannot edit shift', err);
        res.status(500).send({ err: 'Failed to edit shift' });

    }
}

async function getUserShifts(req, res) {
    try {
        const { userId } = req;

        logger.debug('Trying to get user shifts, user ID: ', userId);
        if(!userId) throw "userID not provided!";
        
        const user = await userService.getById(userId);
        
        if(!user) throw "Invalid user ID";

        res.json(user.shifts.map(shift=>{
            shift.dateStarted = utilService.getFormattedDate(shift.timeStarted);
            shift.timeStartedParsed = shift.timeStarted.substr(11, 8);
            shift.timeEndedParsed = shift.timeEnded.substr(11, 8);

            return shift;
        }));
    } catch (err) {
        logger.error('cannot end shift', err);
        res.status(500).send({ err: 'Failed to end shift' });

    }
}



module.exports = {
    startShift,
    endShift,
    getUserShifts,
    editShift
}