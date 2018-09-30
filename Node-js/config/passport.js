const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const dbConfig = require('../config/database');

module.exports = (passport) => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: dbConfig.secret
    };

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        return User.getUserById(jwt_payload._doc._id)
            .then(user => {
                return done(null, user)
            })
            .catch(err => {
                return done(err, false)
            })
    }))
};