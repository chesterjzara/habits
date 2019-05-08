const mongoose = require('mongoose');

const User = require('./users.js');
//const Task = require('./tasks.js')

const habitSchema = new mongoose.Schema({
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    tag: String,
    notes: String,
    date_data: [Date],
    weekly_goal: {
        type: Number,
        default: 1
    },
    weight: {
        type: Number,
        default: 1
    },
    archived: {
        type: Boolean,
        default: false
    },
    public: {
        type: Boolean,
        default: false
    }
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;