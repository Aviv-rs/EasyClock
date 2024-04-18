const userService = require('../../services/user.service');
const logger = require('../../services/logger.service');

async function getAllUsers(req, res) {
    try {
        const { isAdmin } = req;

        logger.debug('Trying to get users');
        if(!isAdmin) throw new Error("Must have admin perms to fetch other user shifts!");
        
        const users = await userService.getSafeUsers();
        
        res.json(users);
    } catch (err) {
        logger.error('Could not get user shifts', err.message);
        res.status(500).send({ err: 'Could not get users' });

    }
}

module.exports = {
    getAllUsers
}