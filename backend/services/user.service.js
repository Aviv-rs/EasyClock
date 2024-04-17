
const dataService = require('./data.service')
const logger = require('./logger.service')

module.exports = {
    getById,
    getByUsername,
    add
} 

async function getById(userId) {
    try {
        const user = dataService.getById(userId);
        delete user.password;

        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = dataService.getByUsername(username)
        console.log('username: ' + username);
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            name: user.name,
            shifts: []
        };
        
        const addedUser = await dataService.create(userToAdd);

        return addedUser
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}





