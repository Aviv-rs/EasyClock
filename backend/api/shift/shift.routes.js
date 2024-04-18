const express = require('express');
const { startShift, endShift, getUserShifts, editShift } = require('./shift.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/start', requireAuth, startShift);
router.post('/end', requireAuth, endShift);
router.put('/edit', requireAuth, editShift);
router.get('/getUserShifts', requireAuth, getUserShifts);

module.exports = router;