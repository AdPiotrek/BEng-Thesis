const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');

const router = express.Router();

router.get('', (req, res, next) => {
    const perPage = 10;
    const page = req.query['page'] ? req.query['page'] : 0;
    const sort = req.query['sort'] || 'name';
    const direction = req.query['direction'] || 'asc';

    Course.find({
        name: new RegExp(req.query.search || '', 'i')
    })
        .limit(perPage)
        .skip(perPage * page)
        .sort({[sort]: direction})
        .then((courses) => {
            console.log(courses);
            Course.count({
                name: new RegExp(req.query.search || '', 'i')
            })
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
    const course = await Course.findOne({name: req.body.name});
    if (course) {
        res.status(404).send({message: 'Nazwa kursu jest zajęta, spróbuj podać inną'});
        return;
    }
    try {
        const courseToCreate = {...req.body};
        courseToCreate.instructors = [req.user._id];
        const user = await User.findById(req.user._id);
        let course = new Course(courseToCreate);
        course.code = Math.random().toString(36).substr(2, 5);

        course = await course.save();
        user.courses.push(course._id);
        await user.save();
        res.send(course)
    } catch (err) {
        console.log(err)
        res.status(500).send({message: 'Wystąpił nieoczekiwany błąd, spróbuj ponownie później'})
    }

});

router.put('/:id/users', async (req, res, next) => {
    let selectedCourse;

    const preparedCourse = await Course.findById(req.params.id);

    const isUserAvailable = preparedCourse.users.find(user => user._id.equals(req.body.userId));
    const isInstructorExist = preparedCourse.instructors.find(instructors => instructors._id.equals(req.body.userId));

    if (isInstructorExist) {
        res.status(404).send({message: 'Jesteś już instruktorem tego kursu'});
        return;
    }

    if (isUserAvailable) {
        res.status(404).send({message: 'Jesteś już uczestnikiem tego kursu'});
        return;
    }

    console.log(preparedCourse.key.toString() !== req.body.key)
    console.log(preparedCourse.key, req.body.key)
    if (preparedCourse.key.toString() !== req.body.key) {
        res.status(404).send({message: 'Podany klucz nie zgadza się'});
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


router.post('/:id/startPressence', async (req, res, next) => {

    const currentDate = new Date();

    const course = await Course.findById(req.params['id']);

    const availableCourseDay = course.courseDays.find(day => day.startTime < currentDate && day.endTime > currentDate);

    if (!availableCourseDay) {
        res.status(400).send();
        return;
    }

    const isAlreadyRegistered = availableCourseDay.presentUsers.find(id => id.equals(req.params.userId));

    if (isAlreadyRegistered) {
        res.status(404).send({message: 'Obecność jest już aktywna'});
        return;
    }

    if (availableCourseDay) {
        availableCourseDay.presentUsers.push(req.body.userId);
        course.save();
        res.send(availableCourseDay);
        return;
    }

    res.send(null)

});

router.get('/:id/active-presences', async (req, res, next) => {
    const currentDate = new Date();
    const course = await Course.findById(req.params['id']).populate({path: 'courseDays.presentUsers', model: 'user'});
    const currentCourseDay = course.courseDays.find(day => day.startTime < currentDate && day.endTime > currentDate);

    res.send(currentCourseDay);
});

router.get('/:id/presences', async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({path: 'courseDays.presentUsers', model: 'user'});
    res.send(course.courseDays.presentUsers)
});

router.get('/:id/courseDays', async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    res.send(course.courseDays)
});

module.exports = router;