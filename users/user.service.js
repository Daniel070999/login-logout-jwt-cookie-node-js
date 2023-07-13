const config = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helper/role');



const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'firstname', lastName: 'lastName', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'firstname', lastName: 'lastName', role: Role.User }
];

async function logIn(res, { username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role, name: user.firstName }, config.secret/*, { expiresIn: '1h' }*/);
        console.log(token);
        return res.cookie("access_token", token, { httpOnly: true }), user;
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports = {
    logIn,
    getAll,
    getById
};