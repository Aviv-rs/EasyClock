require('dotenv').config();

const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTER_KEY)
const userService = require('../../services/user.service');
const logger = require('../../services/logger.service');
const bcrypt = require('bcrypt');


async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`);

  const user = await userService.getByUsername(username);
  if (!user) return Promise.reject('Invalid username or password');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return Promise.reject('Invalid username or password');

  delete user.password
  return user
}

async function signup(username, password, name) {

  logger.debug(
    `auth.service - signup with username: ${username}, name: ${name}`
  );

  if (!username || !password || !name)
    return Promise.reject('name, username and password are required!')

  const salt = await bcrypt.genSalt(12);

  const hash = await bcrypt.hash(password, salt)
  return userService.add({ username, password: hash, name })
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user));
}

async function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken);
    const user = JSON.parse(json);
    if(!user || !user.id || !user.username) throw 'Invalid login token';
    
    const loggedinUser = await userService.getById(user.id);
    if(!loggedinUser || !loggedinUser.id) throw 'Invalid login token';

    return loggedinUser;
  } catch (err) {
    throw 'Invalid login token';
  }
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
