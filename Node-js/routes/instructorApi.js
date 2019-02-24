const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');

const router = express.Router();

const middleware = async (req, res, next) => {
    const course = await Course.findById(req.params['id']);
    if (course.instructors.find(id => (id.equals(req.user._id)))) {
        next();
    } else {
        res.status(403).send({message: 'Nie jesteś instruktorem kursu'})
    }
};

//Get User courses
router.get('/course/:id/users', async (req, res, next) => {
    try {
        console.log('[QUERY]', req.query)
        const perPage = 10;
        const page = req.query['page'] ? req.query['page'] : 0;
        const sort = req.query['sort'];
        const direction = req.query['direction'];

        const courseUsers = await Course.findById(req.params['id']);
        // console.log('[COURSE USERS]' ,courseUsers.users);

        if (courseUsers.users.length === 0) {
            const userPaginationItem = {
                totalPageCount: 0,
                items: []
            };

            res.send(userPaginationItem);
            return;
        }

        const users = await User.find()
            .where('_id')
            .in(courseUsers.users)
            .limit(perPage)
            .skip(perPage * page)
            .sort({[sort]: direction});

        const userPaginationItem = {
            totalPageCount: courseUsers.users.length,
            items: users
        };

        res.send(userPaginationItem);
    } catch (error) {
        console.log(error)
    }

}, middleware);

//Add User To Course
router.put('/course/:id/add/user', async (req, res, next) => {
    try {
        const newUserEmail = req.body.email;
        let course = await Course.findById(req.params['id']);
        let user = await User.findOne({'email': newUserEmail});
        if (!course) {
            res.status(404).send({message: 'Kurs o podanym identyfikatorze nie istnieje'});
            return;
        }
        if (!user) {
            res.status(404).send({message: 'Nie znaleziono użytkownika o podanym emailu'})
            return;
        }

        const userInCourse = course.users.filter(u => {
            return u.equals(user._id)
        });

        if (userInCourse.length) {
            res.status(500).send({message: 'Użytkownik już był dodany do kursu'});
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
        console.log(req.body)
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
            res.status(404).send({message: 'Kurs o podanym identyfikatorze nie istnieje '});
        }
        if (!user) {
            res.status(404).send({message: 'Nie znaleziono podanego użytkownika'})
        }

        const userInCouse = course.users.filter(userToDelete => userToDelete._id.toString() === req.params['userId']);

        if (!userInCouse) {
            res.status(500).send({message: 'Nie znaleziono takiego użytkownika w podanym kursie'});
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
        console.log(course)
        course.courseDays = req.body.courseDays;
        console.warn(course);
            await course.save();
        res.send(course)
    } catch (e) {
        console.log(e);
    }
});


router.put('/course/:id/start-presence/:userId', async (req, res, next) => {
    const course = await Course.findOne({'courseDays._id': req.body.courseDay._id});

    let courseDay = course.courseDays.id(req.body.courseDay._id);

    if (courseDay.presentUsers.some(id => id.equals(req.params['userId']))) {
        res.status(404).send({message: 'Obecność była już wpisana'})
        return;
    }

    courseDay.presentUsers.push(req.params['userId']);

    await course.save();

    res.status(200).send({});

});


//deletePresence
router.put('/course/:id/delete-presence/:userId', async (req, res, next) => {
    const course = await Course.findOne({'courseDays._id': req.body.courseDay._id});
    console.log(course.name)
    let courseDay = course.courseDays.id(req.body.courseDay._id);
    console.log(courseDay)

    courseDay.presentUsers = courseDay.presentUsers.filter(id => {
        console.log(id ,req.params['userId'])
        return !id.equals(req.params['userId'])
    });

    await course.save();

    res.send(courseDay)

});

module.exports = router;

