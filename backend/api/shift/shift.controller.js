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
async function getActiveShift(req, res) {
    try {
        const { userId } = req;

        logger.debug('Trying to find active shift, user ID: ', userId);
        if(!userId) throw "userID not provided!";
        
        const user = await userService.getById(userId);
        
        if(!user) throw "Invalid user ID";
        
        const activeShift = user.shifts.find(shift=>!shift.timeEnded);
        
        res.json(activeShift || null);
    } catch (err) {
        logger.error('Failed to find active shift', err);
        res.status(500).send({ err: 'Failed to find active shift' });

    }
}

async function editShift(req, res) {
    try {
        let { timeEnded, timeStarted, shiftId } = req.body;
        let { userId } = req;

        logger.debug('Trying to edit shift, user ID: ', userId, " time Started: ", timeStarted, " time Ended: ", timeEnded, " shift id: ", shiftId);

        if(!userId || !timeEnded || !timeStarted || +shiftId < 1) throw "userID, shiftID or end time not provided!";

        const isValidShiftTimes = utilService.compareTimeStrings(timeStarted, timeEnded) === -1;

        if(!isValidShiftTimes) throw new Error("Invalid shift times!");

        const user = await userService.getById(userId);
        
        if(!user) throw "Invalid user ID";
        
        const shiftIdx = user.shifts.findIndex(shift=>shift.id === shiftId);

        if(shiftIdx === -1) throw new Error("Shift not found, invalid shiftID");

        let shiftToUpdate = user.shifts[shiftIdx];
        const hourRegex = /\d{2}:\d{2}:\d{2}/;
        const timeStartedParsed = timeStarted;
        const timeEndedParsed = timeEnded;
        
        timeStarted = shiftToUpdate.timeStarted.replace(hourRegex, timeStarted);
        timeEnded = shiftToUpdate.timeEnded.replace(hourRegex, timeEnded);

        user.shifts[shiftIdx] = {...shiftToUpdate, timeStarted, timeEnded};

        userService.update(user.id, 'shifts', user.shifts);

        res.json({...shiftToUpdate, timeStartedParsed, timeEndedParsed, dateStarted: utilService.getFormattedDate(timeStarted)});
    } catch (err) {
        logger.error('cannot edit shift', err.message);
        res.status(500).send({ err: 'Failed to edit shift' });

    }
}

async function adminEditShift(req, res) {
    try {
        let { timeEnded, timeStarted, shiftId, userId } = req.body;

        logger.debug('Trying to edit shift as admin, user ID: ', userId, " time Started: ", timeStarted, " time Ended: ", timeEnded, " shift id: ", shiftId);
        
        if(!userId || !timeEnded || !timeStarted || +shiftId < 1) throw "userID, shiftID or end time not provided!";

        const isValidShiftTimes = utilService.compareTimeStrings(timeStarted, timeEnded);

        if(!isValidShiftTimes) throw "Invalid shift times!";

        const user = await userService.getById(userId);
        
        if(!user) throw new Error("Invalid user ID");
        
        const shiftIdx = user.shifts.findIndex(shift=>shift.id === shiftId);

        if(shiftIdx === -1) throw new Error("Shift not found, invalid shiftID");

        let shiftToUpdate = user.shifts[shiftIdx];
        const hourRegex = /\d{2}:\d{2}:\d{2}/;
        const timeStartedParsed = timeStarted;
        const timeEndedParsed = timeEnded;
        
        timeStarted = shiftToUpdate.timeStarted.replace(hourRegex, timeStarted);
        timeEnded = shiftToUpdate.timeEnded.replace(hourRegex, timeEnded);

        user.shifts[shiftIdx] = {...shiftToUpdate, timeStarted, timeEnded};

        userService.update(user.id, 'shifts', user.shifts);

        res.json({...shiftToUpdate, timeStartedParsed, timeEndedParsed, dateStarted: utilService.getFormattedDate(timeStarted)});
    } catch (err) {
        logger.error('cannot edit shift', err.message);
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
            if(shift.timeStarted) shift.timeStartedParsed = shift.timeStarted.substr(11, 8);
            if(shift.timeEnded) shift.timeEndedParsed = shift.timeEnded.substr(11, 8);

            return shift;
        }).filter(shift=>shift.timeEnded));
    } catch (err) {
        logger.error('Could not get user shifts', err);
        res.status(500).send({ err: 'Could not get user shifts' });

    }
}

async function getUserShiftsById(req, res) {
    try {
        const { isAdmin } = req;
        const { userId } = req.body;

        logger.debug('Trying to get user shifts, user ID: ', userId);
        if(!userId) throw new Error("userID not provided!");
        if(!isAdmin) throw new Error("Must have admin perms to fetch other user shifts!");
        
        const user = await userService.getById(userId);
        
        if(!user) throw new Error("Invalid user ID");

        res.json(user.shifts.map(shift=>{
            shift.dateStarted = utilService.getFormattedDate(shift.timeStarted);
            if(shift.timeStarted) shift.timeStartedParsed = shift.timeStarted.substr(11, 8);
            if(shift.timeEnded) shift.timeEndedParsed = shift.timeEnded.substr(11, 8);

            return shift;
        }).filter(shift=>shift.timeEnded));
    } catch (err) {
        logger.error('Could not get user shifts', err.message);
        res.status(500).send({ err: 'Could not get user shifts' });

    }
}



module.exports = {
    startShift,
    endShift,
    getUserShifts,
    getUserShiftsById,
    getActiveShift,
    adminEditShift,
    editShift
}