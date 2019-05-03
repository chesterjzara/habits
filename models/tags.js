
//Probably not using - at least not to start


const mongoose = require('mongoose');

const Habit = require('./habits.js');
const User = require('./users.js');

const tagsSchema = new mongoose.Schema({
    name: String,
    description: String,
    habitList: [Habit.schema]

})