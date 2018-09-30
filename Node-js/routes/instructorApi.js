const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');

const router = express.Router();

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
    } catch(error) {
        console.log(error)
    }

});

router.put('/course/:id/add/user', async (req, res, next) => {
    try {
        const newUserEmail = req.body.email;
        let course = await Course.findById(req.params['id']);
        let user = await User.findOne({'email': newUserEmail});
        if(!course){
            res.status(404).send({message: 'Kurs o podanym identyfikatorze nie istnieje'});
            return;
        }
        if(!user) {
            res.status(404).send({message: 'Nie znaleziono użytkownika o podanym emailu'})
            return;
        }

        const userInCourse = course.users.filter(u => {
            return u.equals(user._id)
        });

        if(userInCourse.length) {
            res.status(500).send({message: 'Użytkownik już był dodany do kursu'});
            return;
        }
        course.users.push(user._id);
        course = await course.save();
        user.courses.push(course._id);
        await user.save();
        res.send(course)
    } catch(error) {
        console.log(error)
    }
});

router.put('/course/:id', async (req, res, next) => {

});

router.put('/course/:id/delete/user/:userId', async (req, res, next) => {
    try {
        let course = await Course.findById(req.params['id']);
        let user = await User.findById(req.params['userId']);
        if(!course){
            res.status(404).send({message: 'Kurs o podanym identyfikatorze nie istnieje '});
        }
        if(!user) {
            res.status(404).send({message: 'Nie znaleziono podanego użytkownika'})
        }

        const userInCouse = course.users.filter(userToDelete => userToDelete._id.toString() === req.params['userId']);

        if(!userInCouse) {
            res.status(500).send({message: 'Nie znaleziono takiego użytkownika w podanym kursie'});
        }
        course.users = course.users.filter(user => user._id.toString() !== req.params['userId']);
        course = await course.save();
        user.courses = user.courses.filter(course => course._id.toString() !== req.params['id']);
        await user.save();
        res.send(course)
    } catch(error) {
        console.log(error)
    }
});

router.put('/course/:id/coursedays', (req, res, next) => {
});

router.put('/course/:id/endPresence/:presenceId', async (req, res, next) => {
    let course = await Course.findById(req.params['id']);
    const presence = course.usersPresences.id(req.params['presenceId']);
    if(!presence.isActive) {
        res.status('404').send({message: 'Podana obecność została wcześniej zakończona'})
    }
    presence.isActive = false;
    presence.endDate = new Date();
    course = await course.save();
    res.send(course)
});

router.put('/course/:id/presence', async (req, res, next) => {
    let course = await Course.findById(req.params['id']);
    let presence = await course.usersPresences.id(req.body.presence._id);
    presence = {...req.body.presence}

    course = await course.save();
    res.send(course)
});

router.put('/course/:id/presences/:userId', async (req, res, next) => {
    const course = await Course.findById(req.params['id']);
    course.usersPresences = course.usersPresences.filter(presence => {
        return !presence.user.equals(req.params['userId'])
    });

    let newPresences = req.body;

    newPresences.map((presence) => {
        return {
            ...presence,
            plannedEnding: presence.endTime
        }
    });

    course.usersPresences = [...course.usersPresences, ...newPresences];

    await course.save();
    res.send(course);
});






module.exports = router;

