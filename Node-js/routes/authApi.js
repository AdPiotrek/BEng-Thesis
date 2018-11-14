const express = require('express');
const router = express.Router();
const dbConfig = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.get('/404', (req,res,next) => {
    req.status(404).send();
})

router.post('/register', (req, res, next) => {
    const newUser = new User(req.body);
    User.addUser(newUser)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            if (err.code === 11000) {
                res.status('404').send({
                    error: 'User with this email already exists'
                });
            } else {
                res.status('500').send();
            }
        })
});

router.post('/login', (req, res, next) => {
    console.log('login')
    let fetchedUser;
    User.getUserByEmail(req.body.email)
        .then((user) => {
            fetchedUser = user;
            return User.comparePassword(req.body.password, user.password);
        })
        .then(isMatch => {
            delete fetchedUser.password;
            if (isMatch) {
                const token = jwt.sign({...fetchedUser}, dbConfig.secret, {
                    expiresIn: 100000000000000000
                });
                res.json({
                    token: `Bearer ${token}`,
                    user: fetchedUser
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Wrong password'
                })
            }
        })
        .catch(err => {
            if (err.status === 404) {
                res.status(404).json(err);
            }
        })
});

router.get('/serverTime', (req, res, next) => {
    return res.send(new Date())
});

module.exports = router;