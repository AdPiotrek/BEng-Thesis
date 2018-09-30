const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Name field is required']
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: [true, 'User with this email already exists'],
        default: false
    },
    password: {
        type: String,
        select: false
    },

    role: {
        type: String,
        enum: ['admin', 'user', 'instructor'],
        default: 'user',
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    __v: {
        type: Number,
        select: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const User = mongoose.model('user', UserSchema)
module.exports = User;

module.exports.getUserById = (id) => {
    return User.findById(id);
};

module.exports.getUserByEmail = (email) => {
    return User.findOne({
            email: email
        }).select('+password')
        .then(user => {
            return user ? user : Promise.reject({
                message: 'User with this email doesn\'t exists',
                status: 404
            })
        });
};

module.exports.addUser = (newUser) => {
    return bcrypt.genSalt(10)
        .then(salt => {
            return bcrypt.hash(newUser.password, salt)
        })
        .then(hash => {
            newUser.password = hash;
            return newUser.save();
        });
};

module.exports.getUserCourses = (id) => {
    return User.findById(id)
        .populate('courses')
};

module.exports.comparePassword = (candidatePassword, hash) => {
    return bcrypt.compare(candidatePassword, hash);
};

