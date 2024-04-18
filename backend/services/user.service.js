
const dataService = require('./data.service')
const logger = require('./logger.service')

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

async function getSafeUsers() {
    try {
        let users = dataService.getAll().map(user=>{
            const {id, name} = user;
            return {id, name};
        });

        return users;
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = dataService.getByUsername(username);
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
            perms: 'user',
            shifts: []
        };
        
        const addedUser = await dataService.create(userToAdd);

        return addedUser
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

async function update(userId, property, value) {
    try {
        const userToUpdate = await dataService.getById(userId);
        if(!userToUpdate[property]) throw "invalid property!";
        userToUpdate[property] = value;
        const isUpdateSuccessful = dataService.update(userToUpdate.id, userToUpdate);
        
        return isUpdateSuccessful;
    } catch (err) {
        logger.error('cannot update user', err)
        throw err
    }
}


module.exports = {
    getById,
    getSafeUsers,
    getByUsername,
    add,
    update
} 