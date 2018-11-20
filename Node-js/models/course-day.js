const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseDaySchema = new Schema({
    startTime: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End date is required']
    },
    presentUsers: [{
        type: Schema.Types.ObjectId,
    }],
    partsCount: {
        type: Number
    }
});

module.exports = courseDaySchema;
