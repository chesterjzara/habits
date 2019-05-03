const mongoose = require('mongoose');

const Habit = require('./habits.js');

const taskSchema = new mongoose.Schema({
    habitRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
    enteredDate: Date,
    notes: String
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;