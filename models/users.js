const mongoose = require('mongoose');

const Habit = require('./habits.js');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true},
    password: String,
    display_name: String,
    habit_list: [Habit.schema],
    tag_list: [String]
});

const User = mongoose.model('User', userSchema);

module.exports = User;