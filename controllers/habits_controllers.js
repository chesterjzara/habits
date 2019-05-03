const express = require('express')
const router = express.Router();

const User = require('../models/users.js');
const Habit = require('../models/habits.js');

// New habit page
router.get('/new', (req,res)=> {
    res.render('habits/new.ejs', {
        currentUser: req.session.currentUser
    });
});

//Habit Index Page - show all habits for current user
router.get('/index', (req, res) => {
    let currentUser = req.session.currentUser
    User.findById(currentUser, (err, foundUser) => {
        let userID = foundUser._id;
        res.send(foundUser);
        // res.render('habits/index.ejs', {
        //     currentUser : currentUser
        // })
    })
    
    
})

//Create new Habit
router.post('/', (req,res) => {
    let currentUser = req.session.currentUser;
    let newHabit = req.body;


    User.findById(currentUser._id, (err,foundUser) => {
        newHabit.userRef = foundUser._id;
        Habit.create(
            newHabit,
            (err, createdHabit) => {
                foundUser.habit_list.push(createdHabit);
                foundUser.save((err, data)=>{
                    res.redirect(`/habits/index`)
                })
            }
        )
    })
   
})

module.exports = router;