const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');

const router = express.Router();

//Get User courses
router.get('/course/:id/users', async (req, res, next) => {
    try {
        const course = await Course.findById(req.params['id']).populate('users');

        let perPage = 10;
        let page = req.params['page'] > 0 ? req.params['page'] : 0;
        const userPaginationItem = {
            totalPageCount: Math.ceil(course.users.length / 10),
            items: course.users.slice(page, page * perPage + perPage)
        };
        res.send(userPaginationItem);
    } catch (error) {
        console.log(error)
    }

});

//Add User To Course
router.put('/course/:id/add/user', async (req, res, next) => {
    try {
        const newUserEmail = req.body.email;
        let course = await Course.findById(req.params['id']);
        let user = await User.findOne({ 'email': newUserEmail });
        if (!course) {
            res.status(404).send({ message: 'Kurs o podanym identyfikatorze nie istnieje' });
            return;
        }
        if (!user) {
            res.status(404).send({ message: 'Nie znaleziono użytkownika o podanym emailu' })
            return;
        }

        const userInCourse = course.users.filter(u => {
            return u.equals(user._id)
        });

        if (userInCourse.length) {
            res.status(500).send({ message: 'Użytkownik już był dodany do kursu' });
            return;
        }
        course.users.push(user._id);
        course = await course.save();
        user.courses.push(course._id);
        await user.save();
        res.send(course)
    } catch (error) {
        console.log(error)
    }
});

//Update course
router.put('/course/:id', async (req, res, next) => {
    try {
        let course = await Course.findByIdAndUpdate(req.params['id'], req.body.course);
        res.send(course)
    } catch (e) {
        console.log(e);
    }

});

//Delete user from course
router.put('/course/:id/delete/user/:userId', async (req, res, next) => {
    try {
        let course = await Course.findById(req.params['id']);
        let user = await User.findById(req.params['userId']);
        if (!course) {
            res.status(404).send({ message: 'Kurs o podanym identyfikatorze nie istnieje ' });
        }
        if (!user) {
            res.status(404).send({ message: 'Nie znaleziono podanego użytkownika' })
        }

        const userInCouse = course.users.filter(userToDelete => userToDelete._id.toString() === req.params['userId']);

        if (!userInCouse) {
            res.status(500).send({ message: 'Nie znaleziono takiego użytkownika w podanym kursie' });
        }
        course.users = course.users.filter(user => user._id.toString() !== req.params['userId']);
        course = await course.save();
        user.courses = user.courses.filter(course => course._id.toString() !== req.params['id']);
        await user.save();
        res.send(course)
    } catch (error) {
        console.log(error)
    }
});

router.put('/course/:id/coursedays', async (req, res, next) => {

    try {
        let course = await Course.findById(req.params['id']);
        req.params.body.courseDays.forEach((courseDay) => {
            if(courseDay._id) {
                course.courseDays.id(courseDay._id) = {...course.courseDays.id(courseDay._id), courseDay};
            }
            course.courseDays.push(courseDay);
        });
        await course.save();
        res.send(course)
    } catch (e) {
        console.log(e);
    }
});


router.put('/course/:id/start-presence/:userId', async (req, res, next) => {
    const course = await Course.findOne({ 'courseDays._id': req.body.courseDay._id });

    let courseDay = course.courseDays.id(req.body.courseDay._id);

    if (courseDay.presentUsers.some(id => id.equals(req.params['userId']))) {
        res.status(404).send({ message: 'Obecność była już wpisana' })
        return;
    }

    courseDay.presentUsers.push(req.params['userId']);

    await course.save();

    res.status(200).send({});

});


//deletePresence
router.put('/course/:id/delete-presence/:userId', async (req, res, next) => {
    const course = await Course.findOne({ 'courseDays._id': req.body.courseDay._id });

    let courseDay = course.courseDays.id(req.body.courseDay._id);

    courseDay.presentUsers = courseDay.presentUsers.filter(id => !id.equals(req.params['userId']));

    await course.save();

    res.send(courseDay)

});

module.exports = router;

