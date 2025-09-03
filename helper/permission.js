const { userHasPermission, userHasRole } = require("../db/getAuthDb");

function requireRole(role) {
    return async (req, res, next) => {
        try {
            const userId = req.user.id; // angenommen aus JWT Middleware
            if (await userHasRole(userId, role)) {
                return next();
            }
            return res.status(403).json({ error: "Zugriff verweigert: Rolle fehlt" });
        } catch (err) {
            return res.status(500).json({ error: "Role check failed" });
        }
    };
}
async function requirePermission(permission) {

    return async (req, res, next) => {

        const userId = req.user.id
        if (await userHasPermission(userId, permission)) {
            next();
        } else {
            res.status(403).json({ error: "Keine Berechtigung" });
        }

    };
}

module.exports = { requirePermission, requireRole }