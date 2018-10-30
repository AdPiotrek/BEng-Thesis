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

router.get('/:id/presences/:courseId', async (req, res, next) => {

    const course = await Course.findById(req.params['courseId']);

    let userPresences = course.courseDays.map((courseDay) => {
        if (courseDay.presentUsers.find(id => id.equals(req.params['id']))) {
            return courseDay;
        }

        return null;
    });

    userPresences = userPresences.filter(x => !!x)

    res.send(userPresences)


});

router.get('/:id/activePresence/:courseId', async (req, res, next) => {


    const currentDate = new Date();

    const course = await Course.findById(req.params['courseId']);

    const availableCourseDay = await course.courseDays.find(day => day.startTime < currentDate && day.endTime > currentDate);

    if (availableCourseDay) {
        presence = availableCourseDay.presentUsers.find((id) => id.equals(req.params['id']))
        res.send(availableCourseDay)
        return;
    }

    res.send(null);

});

module.exports = router;