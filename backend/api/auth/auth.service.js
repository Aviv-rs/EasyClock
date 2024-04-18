require('dotenv').config();

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.CRYPTER_KEY;
const IV_LENGTH = 16;

const userService = require('../../services/user.service');
const logger = require('../../services/logger.service');
const bcrypt = require('bcrypt');


async function login(username, password) {
  try {
    logger.debug(`auth.service - login with username: ${username}`);

    const user = await userService.getByUsername(username);
    if (!user) return Promise.reject('Invalid username or password');
    const match = await bcrypt.compare(password.trim(), user.password.trim());
    if (!match) return Promise.reject('Invalid username or password');
    
    delete user.password;
    return user
  } catch (error) {
    logger.error('Failed to login ', error);
    throw error;
  }

}

async function signup(username, password, name) {
  logger.debug(`auth.service - signup with username: ${username}, name: ${name}`);

  if (!username || !password || !name) {
    throw new Error("Name, username, and password are required!");
  }

  const isUsernameTaken = await userService.getByUsername(username);
  if (isUsernameTaken) {
    throw new Error("Username already taken!");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return userService.add({ username, password: hash, name });
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
}


function getLoginToken(user) {
  try {
    return encrypt(JSON.stringify(user));
  } catch (error) {
    logger.error('Failed to get login token, ' + error.message);
    console.log('error while fetching login token: ', error.message);
  }
}

async function validateToken(loginToken) {
  try {
    const json = decrypt(loginToken);
    const user = JSON.parse(json);
    if(!user || !user.id || !user.username) throw 'Invalid login token';
    
    const loggedinUser = await userService.getById(user.id);
    if(!loggedinUser || !loggedinUser.id) throw 'Invalid login token';

    return loggedinUser;
  } catch (err) {
    throw 'Invalid login token';
  }
}

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(algorithm, Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
