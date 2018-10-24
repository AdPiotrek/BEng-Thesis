const express = require('express');
const schedule = require('node-schedule');
const Course = require('../models/course');
const User = require('../models/user');

const router = express.Router();

router.get('', (req, res, next) => {
    let perPage = 10;
    let page = req.params['page'] > 0 ? req.params['page'] : 0;
    Course.find()
        .limit(perPage)
        .skip(perPage * page)
        .sort({ name: 'asc' })
        .then((courses) => {
            Course.count()
                .then(totalPageCount => {
                    const coursePaginationItem = {
                        totalPageCount: Math.ceil(totalPageCount / perPage),
                        items: courses
                    };
                    res.json(coursePaginationItem);
                })
        })
        .catch((err) => {
            res.status(500).send();
        })
});


router.post('', async (req, res, next) => {
    await  Course.findOne({name: req.body.name});
    if(course) {
        res.status(404).send({message: 'Nazwa kursu jest zajęta, spróbuj podać inną'})
        return;
    }
    try {
        const courseToCreate = {...req.body};
        courseToCreate.instructors = [req.user._id];
        const user = await User.findById(req.user._id);
        let course = new Course(courseToCreate);
        course.code = '2XCZ';

        course = await course.save();
        user.courses.push(course._id);
        await user.save();
        res.send(course)
    } catch(err) {
        console.log(error)
        res.status(500).send({message: 'Wystąpił nieoczekiwany błąd, spróbuj ponownie później'})
    }

});

router.put('/:id/users',async  (req, res, next) => {
    let selectedCourse;

    const preparedCourse =  await Course.findById(req.params.id);

    const isUserAvailable = preparedCourse.users.find(user => user._id.equals(req.body.userId));

    if(isUserAvailable) {
        res.status(404).send({message: 'Jestes już uczetnikiem tego kursu'})
        return;
    }

    if(preparedCourse.key.toString() !== req.body.key) {
        res.status(404).send({message: 'Podany klucz nie zgadza się'})
        return;
    }

    Course.findById(req.params.id)
        .then(course => {
            course.users.push(req.body.userId);
            return course.save()
        })
        .then(course => {
            selectedCourse = course
            return User.findById(req.body.userId)
        })
        .then(user => {
            user.courses.push(req.params.id);
            return user.save();
        })
        .then(() => {
            res.send(selectedCourse);
        })
        .catch(err => res.status(500))
});


router.post('/:id/startPressence', (req, res, next) => {

    const currentDate = new Date();

    Course.findOne({ _id: req.params['id'], 'usersPresences.isActive': true, 'usersPresences.user': req.body.userId })
        .then(course => {
            console.log(course)
            if (course === null) {
                return Course.findById(req.params['id'])
            }

            return Promise.reject({
                status: 404,
                message: 'You have currently started presence'
            });
        })
        .then(async (course) => {
            const availableCourseDay = course.courseDays.find(day => day.startTime < currentDate && day.endTime > currentDate);

            if (availableCourseDay) {
                course.usersPresences.push({
                    user: req.body.userId,
                    startTime: currentDate,
                    endTime: null,
                    plannedEnding: availableCourseDay.endTime
                });

                console.log('registeredPresence', course.usersPresences.slice(-1));

                await course.save();
                return Promise.resolve(course.usersPresences.slice(-1))
            }

            return Promise.reject({ status: '404', message: 'There are no lessons during this time' })
        })
        .then(presence => res.send(presence))
        .catch(err => res.status(500).send(err))
});

router.put('/:id/endPresence', (req, res, next) => {

    Course.findById(req.params['id'])
        .then((course) => {
            const presence = course.usersPresences.id(req.body._id);
            presence.isActive = false;
            presence.endTime = new Date();
            console.log(course.usersPresences.id(req.body._id));
            return course.save()
        })
        .then((savedCourse) => {
            res.send(savedCourse)
        })
        .catch((err) => {
            res.status(404);
        });
});

router.get('/:id/active-presences', async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate({path: 'usersPresences.user', model: 'user'});
    console.log(course)
    let activePresences = course.usersPresences.filter(presence => presence.isActive)
    res.send(activePresences)
});

router.get('/:id/presences', async(req, res, next) => {
    const course = await Course.findById(req.params.id);
    res.send(course.usersPresences)
});

module.exports = router;