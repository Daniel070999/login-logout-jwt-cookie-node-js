const { expressjwt: expressJwt } = require('express-jwt');
const { secret } = require('../config.json');

function authorize(roles = []) {
    /**
     * Se obtienen el rol en sesion (Admin, User)
     */
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        expressJwt({ secret, algorithms: ['HS256'] }),
        // verifica si tiene acceso en base a su rol
        (req, res, next) => {
            if (roles.length && !roles.includes(req.auth.role)) {
                // en caso que no tenga el rol necesario, no se autoriza
                return res.status(401).json({ message: 'No tiene permisos' });
            }
            next();
        }
    ];
}

module.exports = authorize;
