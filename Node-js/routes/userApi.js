const express = require('express');
const User = require('../models/user');
const Course = require('../models/course')

const compareByNameAsc = (course1, course2) => {
    if (course1.name > course2.name) return 1;
    if (course2.name > course1.name) return -1;
    return 0;
};

const compareByNameDesc = (course1, course2) => {
    console.log('desc')
    if (course1.name > course2.name) return -1;
    if (course2.name > course1.name) return 1;
    return 0;
};

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

router.get('/:id/courses', (req, res, next) => {
    const perPage = 10;
    const page = req.query['page'] ? req.query['page'] : 0;
    const sort = req.query['sort'];
    const direction = req.query['direction'];
    let compareFn;
    console.log(direction)
    if (direction === 'asc') {
        compareFn = compareByNameAsc;
    } else {
        compareFn = compareByNameDesc;
    }


    User.getUserById(req.params['id'])
        .populate('courses')
        .then((user) => {
            const slicedCourses = user.courses.slice(page, page * perPage + perPage);
            const sortedCourses = slicedCourses.sort(compareFn);

            const coursePaginationItem = {
                totalPageCount: Math.ceil(user.courses.length / 10),
                items: sortedCourses
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
        let presence = availableCourseDay.presentUsers.find((id) => id.equals(req.params['id']));
        console.log(presence);
        if (presence) {
            res.send(availableCourseDay);
            return;
        }
    }

    res.send(null);

});

module.exports = router;