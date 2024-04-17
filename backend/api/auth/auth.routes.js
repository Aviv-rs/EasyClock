const express = require('express')
const {login, signup, logout, checkAuth} = require('./auth.controller')

const router = express.Router()

router.get('/check', checkAuth)
router.post('/login', login)
router.post('/signup', signup)
router.delete('/logout', logout)

module.exports = router