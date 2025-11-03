
function requireRole(role) {
    return async (req, res, next) => {
        try {
            const roles = req.user.realm_access.roles; // angenommen aus JWT Middleware
            if (roles.includes(role)) {
                return next();
            }
            return res.status(403).json({ error: "Zugriff verweigert: Rolle fehlt" });
        } catch (err) {
            console.error("Role check error:", err);
            return res.status(500).json({ error: "Role check failed" });
        }
    };
}


module.exports = { requireRole }