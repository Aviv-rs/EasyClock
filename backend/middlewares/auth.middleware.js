const logger = require('../services/logger.service');
const authService = require('../api/auth/auth.service');

async function requireAuth(req, res, next) {
  const { loginToken } = req.cookies
  try {
      logger.info('Req was made, checking for user auth');
      const user = await authService.validateToken(loginToken);

      if(user && +user.id > 0 && loginToken) {
        req.userId = user.id;
        req.isAdmin = user.perms === 'admin';
        next();
      }
      else throw "Unauthorized user!"

  } catch (err) {
      logger.error('Failed to authenticate user: ' + err);
      if(loginToken) res.clearCookie('loginToken');
      res.status(401).send({err});
  }
}
async function requireAdmin(req, res, next) {
  const { loginToken } = req.cookies;
  try {
      logger.info('Admin required action request made, checking auth');
      const user = await authService.validateToken(loginToken);

      if(user && +user.id > 0 && loginToken && user.perms === 'admin') {
        req.userId = user.id;
        req.isAdmin = true;
        next();
      }
      else throw new Error("Unauthorized user! only admins allowed");

  } catch (err) {
      logger.error('Failed to authenticate user: ' + err.message);
      if(loginToken) res.clearCookie('loginToken');
      res.status(401).send({err:err.message});
  }
}

module.exports = {
  requireAuth,
  requireAdmin
}
