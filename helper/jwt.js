require('dotenv/config');
const { expressjwt: jwt } = require("express-jwt");
const logger = require('./logger');

function authJwt() {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const jwtMiddleware = jwt({
      secret,
      algorithms: ["HS256"],
      requestProperty: "user",
      isRevoked,
    });

    const flattenUser = (req, res, next) => {
      if (req.user && req.user.user) {
        req.user = req.user.user; // nur der user Teil
      }
      next();
    };
    // return eine kombinierte Middleware für Express
    const openPaths = [

      process.env.NODE_ENV != 'prod' ? { url: /\/api\/v4\/docs(.*)/, methods: ["GET", "OPTIONS"] } : {},

    ]

    return (req, res, next) => {
      const pathAllowed = openPaths.some((p) => {
        if (!p.url || !p.methods) return false;
        if (!(p.url instanceof RegExp)) return false;
        return p.url.test(req.path) && p.methods.includes(req.method);
      });

      if (pathAllowed) return next();

      jwtMiddleware(req, res, (err) => {
        if (err) return next(err);
        flattenUser(req, res, next);
      });
    };

  } catch (error) {
    console.error("JWT Error")
    console.error(error)
    throw error
  }
}

async function isRevoked(req, token) {
  try {
    // Demo-Tokens ohne user erlauben
    if (!token.payload?.user) {
      return false;
    }

    // Optional: nur Admins erlauben
    if (!token.payload.user.isAdmin) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("JWT isRevoked error:", error);
    logger.error(error, "Error while checking if JWT is revoked. Message: " + error.message);
    return true; // bei Fehler ablehnen
  }
}


module.exports = { authJwt };