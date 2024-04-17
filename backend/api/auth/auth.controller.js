const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function checkAuth(req, res) {
    const { loginToken } = req.cookies
    try {
        logger.info('Checking user authentication');
        const user = await authService.validateToken(loginToken);

        res.json(user);
    } catch (err) {
        logger.error('Failed to Login ' + err);
        res.clearCookie('loginToken');
        res.status(401).send({err});
    }
}

async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)

        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err })
    }
}

async function signup(req, res) {
    try {
        const { username, password, name } = req.body
        console.log(req.body);
        // Never log passwords
        // logger.debug(name + ', ' + username + ', ' + password)
        const account = await authService.signup(username, password, name)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User signup: ', user)
        res.cookie('loginToken', loginToken)

        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res){
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout,
    checkAuth
}