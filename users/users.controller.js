const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('../helper/authorize')
const Role = require('../helper/role');


router.post('/login', logIn);                                 // ruta publica
router.get('/', authorize(Role.Admin), verifyLoggin, getAll); // acceso solo administrador y logeado
router.get('/:id', authorize(), verifyLoggin, getById);       // cualquier usuario autorizado y logeado
router.post('/logout', authorize(), logOut);                  // cualquier usuario autorizado

function logIn(req, res, next) {
    userService.logIn(res, req.body)
        .then(user => user
            ? res.json(user)
            : res.status(400).json({ message: 'Credenciales incorrectas' }))
        .catch(err => next(err));
}

function logOut(req, res) {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Sesion cerrada" });
};

function verifyLoggin(req, res, next) {
    const authorization = req.headers.authorization.split(' ')[1]
    const cookie = req.cookies.access_token;
    if (cookie != null && authorization == cookie) {
        next();
    } else {
        res.status(200).json({ message: "No esta en sesion" });
    }
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.auth;
    const id = parseInt(req.params.id);
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'No tiene permisos' });
    }
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

module.exports = router;
