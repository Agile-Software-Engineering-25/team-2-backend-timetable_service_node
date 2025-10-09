require('dotenv/config');
const { expressjwt: jwt } = require("express-jwt");
const logger = require('./logger');
const fs = require('fs')
const jwksRsa = require("jwks-rsa");

// JWKS-Client konfigurieren
const jwksUri = "https://keycloak.sau-portal.de/realms/sau/protocol/openid-connect/certs";

function authJwt() {
  try {
    const jwtMiddleware = jwt({
      secret: process.env.NODE_ENV !== 'prod' ? fs.readFileSync('./keys/public.pem') : jwksRsa.expressJwtSecret({
        cache: true,            // Zwischenspeichern der Keys für bessere Performance
        rateLimit: true,        // Verhindert zu viele Anfragen an Keycloak
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
      algorithms: ["RS256"],
      requestProperty: "user",
      issuer: "https://keycloak.sau-portal.de/realms/sau",
      isRevoked,
    });

    const flattenUser = (req, res, next) => {
      req.user = {
        realm_access: req.user.realm_access,
        resource_access: req.user.resource_access,
      }
      // nur der user Teil
      next();
    };
    // return eine kombinierte Middleware für Express
    const openPaths = [
      { url: /\/api\/v1\/login(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/timetable\/health$/, methods: ["GET", "OPTIONS"] },

      process.env.NODE_ENV != 'prod' ? { url: /\/api\/v1\/docs(.*)/, methods: ["GET", "OPTIONS"] } : {},

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
    // invalid token - synchronous

    return false;
  } catch (error) {
    console.error("JWT isRevoked error:", error);
    logger.error(error, "Error while checking if JWT is revoked. Message: " + error.message);
    return true; // bei Fehler ablehnen
  }
}


module.exports = { authJwt };