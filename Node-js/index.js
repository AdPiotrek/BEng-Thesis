const express = require('express');
const authRoutes = require('./routes/authApi')
const userRoutes = require('./routes/userApi')
const courseRoutes = require('./routes/courseApi')
const instructorRoutes = require('./routes/instructorApi');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();

//Db connection
try {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/ninjago')
        .then(() => {
            console.log('success');
        })
        .catch((err) => {
            console.log(err);
        });

//Passport config
    require('./config/passport')(passport)


    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());


//cors
    app.use(cors());


//Routes
    app.use('/api', authRoutes);
    app.use(passport.authenticate('jwt', { session: false }));
    app.use('/users', userRoutes);
    app.use('/courses', courseRoutes);
    app.use('/instructor', instructorRoutes);

    let privateKey = fs.readFileSync( './config/security/key.pem', 'utf8' ).toString();
    let certificate = fs.readFileSync( './config/security/cert.pem', 'utf8' ).toString();

    const credentials = {
        key: privateKey,
        cert: certificate,
        passphrase: 'qwerty'
    };


    // const httpServer = https.createServer(credentials, app);
    // httpServer.listen(4000)

    app.listen(4000, () => {
        'Express saying hello to the world :D';
    })
} catch (e) {
    console.log(e)
}