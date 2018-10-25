const mongoose = require('mongoose');
const presenceTimeSchema = require('./presence-time');
const courseDaySchema = require('./course-day');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    key: {
        type: String,
        required: [true, 'Key is required'],
    },
    partsCount: {
        type: Number,
        required: [true, 'Parts quantity is required'],
        min: 1
    },
    lessonTime: {
        type: String,
        required: [true, 'Lesson time is required']
    },
    breakTime: {
        type: String,
        required: [true, 'Break time is required']
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    instructors: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    code: {
        type: String,
    },
    courseDays: [
        courseDaySchema
    ]
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;