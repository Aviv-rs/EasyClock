const express = require('express');
const { startShift, endShift, getUserShifts, editShift, getUserShiftsById, getActiveShift } = require('./shift.controller');
const { requireAuth, requireAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/start', requireAuth, startShift);
router.post('/end', requireAuth, endShift);
router.put('/edit', requireAdmin, editShift);
router.get('/getUserShifts', requireAuth, getUserShifts);
router.get('/getActive', requireAuth, getActiveShift);
router.post('/getUserShiftsById', requireAdmin, getUserShiftsById);

module.exports = router;