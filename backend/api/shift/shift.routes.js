const express = require('express');
const { startShift, endShift, getUserShifts, editShift, getUserShiftsById, getActiveShift, adminEditShift } = require('./shift.controller');
const { requireAuth, requireAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/start', requireAuth, startShift);
router.post('/end', requireAuth, endShift);
router.put('/edit', requireAuth, editShift);
router.put('/editAdmin', requireAdmin, adminEditShift);
router.get('/getUserShifts', requireAuth, getUserShifts);
router.get('/getActive', requireAuth, getActiveShift);
router.post('/getUserShiftsById', requireAdmin, getUserShiftsById);

module.exports = router;