const express = require('express');
const User = require('../models/user');
const Course = require('../models/course')

const router = express.Router();

router.get('', (req, res, next) => {
    User.find({})
        .then((users) => {
            res.send(users);
        })
        .catch(x => {
            console.log(x)
        })
});

router.get('/:id', (req, res, next) => {
    User.getUserById(req.params['id'], 'rank name')
        .then((ninjas) => {
            res.json(ninjas);
        })
});

router.put('/:id', (req, res, next) => {
    res.send({
        type: 'put'
    });
});

router.delete('/:id', (req, res, next) => {
    res.send({
        type: 'delete'
    });
});

router.get('/:id/courses', (req, res, next) => {
    let perPage = 10;
    let page = req.params['page'] > 0 ? req.params['page'] : 0;
    User.getUserById(req.params['id'])
        .populate('courses')
        .then((user) => {

            const coursePaginationItem = {
                totalPageCount: Math.ceil(user.courses.length / 10),
                items: user.courses.slice(page, page * perPage + perPage)
            };
            res.send(coursePaginationItem);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

router.get('/:id/presences/:courseId', (req, res, next) => {
    User.getUserById(req.params['id'])
        .populate('courses')
        .then((user) => {
            const course = user.courses.find((course) => course._id.toString() === req.params['courseId']);

            const presences = course.usersPresences.filter((presence) => {
                return presence.user.toString() === req.params['id']
            });

            return res.send(presences)
        })
});

router.get('/:id/activePresence/:courseId', (req, res, next) => {
    Course.findById(req.params['courseId'])
        .then(course => {
            res.send(...course.usersPresences.filter(presence => presence.user.toString() === req.params['id'] && presence.isActive));
        })
});

module.exports = router;