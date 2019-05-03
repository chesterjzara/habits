const mongoose = require('mongoose');

const User = require('./users.js');
//const Task = require('./tasks.js')

const habitSchema = new mongoose.Schema({
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    tag: String,
    notes: String,
    date_data: [Date]
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;