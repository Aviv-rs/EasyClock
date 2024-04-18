const express = require('express');
const { getAllUsers } = require('./user.controller');
const { requireAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/getAll', requireAdmin, getAllUsers);

module.exports = router;