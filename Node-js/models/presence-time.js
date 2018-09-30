const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const presenceTimeSchema = new Schema({
    startTime: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endTime: {
        type: Date,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    plannedEnding: {
        type: Date,
        required: true
    }
});

module.exports = presenceTimeSchema;