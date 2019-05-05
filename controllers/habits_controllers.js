const express = require('express')
const router = express.Router();
const moment = require('moment');

const User = require('../models/users.js');
const Habit = require('../models/habits.js');

module.exports = router;

/////////////////////////////////////
//          Rest/CRUD Routes
/////////////////////////////////////

// New habit page
router.get('/new', (req,res)=> {
    
    console.log(req.query);

    res.render('habits/new.ejs', {
        currentUser: req.session.currentUser,
        category: req.query.category
    });
});
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
                
                if(foundUser.tag_list.indexOf(createdHabit.tag) === -1){
                    foundUser.tag_list.push(createdHabit.tag)
                }

                foundUser.save((err, data)=>{
                    res.redirect(`/habits/index`);
                });
            }
        );
    });
});

//Habit Index Page - show all habits for current user
router.get('/index', (req, res) => {

    let currentUser = req.session.currentUser
    if(currentUser) {
        User.findById(currentUser, (err, foundUser) => {
            //res.send(foundUser);
            
            //Sort the 
            for(let habElement of foundUser.habit_list) {
                console.log(habElement);
                habElement.date_data.sort( (a,b) => {
                    if(moment(a).isBefore(b, 'day')) {return -1}
                    if(moment(a).isAfter(b, 'day')) {return 1}
                    return 0;
                })
            }


            //Send the current user 
            res.render('habits/index.ejs', {
                currentUser : currentUser,
                habits: foundUser.habit_list,
                tags: foundUser.tag_list
            })
        })
    } else {
        req.flash('info', 'Please log in first')
        res.redirect('/sessions/new');
    }
    
})

//Show 
router.get('/:id' ,(req,res) => {
    let habitId = req.params.id;
    Habit.findById( habitId, (err, foundHabit) => {
        res.render('habits/show.ejs', {
            currentUser: req.session.currentUser,
            habit: foundHabit
        });
    })
})

//Destroy 
router.delete('/:id', (req, res) => {
    let habitId = req.params.id
    Habit.findByIdAndRemove(habitId, (err, removedHabit) => {
        User.findOne({'habit_list._id' : habitId }, (err, foundUser)=> {
            foundUser.habit_list.id(habitId).remove();
            foundUser.save( (err, data) => {
                redirect('/habits/index');
            });
        });
    });
});

//Edit 
//Update

///////////////////////////////////////////////
//      Updating Date Array (check/uncheck)
///////////////////////////////////////////////

router.post('/uncheck/:id', (req, res) => {
    let date = moment(req.body.date).toDate();
    // let userId = req.session.currentUser._id;
    // let removalId = req.params.id;
    // console.log(date, userId, removalId);
    
    let habitId = req.params.id


    if(habitId){
        Habit.findById( habitId, (err, foundHabit) => {
            for(let i=0; i < foundHabit.date_data.length; i++) {
                if(moment(foundHabit.date_data[i]).isSame(date, 'day')){
                    foundHabit.date_data.splice(i,1);
                }
            }
            foundHabit.save((err,savedHabit) => {
                //Find user based off habit
                User.findById(savedHabit.userRef,(err, foundUser) => {
                    //res.send(savedHabit);
                    let origIndex = foundUser.habit_list.findIndex( (e)=> {
                        return e._id.equals(savedHabit._id);
                    })
                    foundUser.habit_list.id(habitId).remove();
                    savedHabit.date_data.sort( (a,b) => {
                        if(moment(a).isBefore(b, 'day')) {return -1}
                        if(moment(a).isAfter(b, 'day')) {return 1}
                        return 0;
                    })
                    foundUser.habit_list.splice(origIndex,0,savedHabit);
                    foundUser.save( (err, savedUser)=> {
                        res.send(savedUser);
                    })
                    //res.send(foundUser.habit_list);
                });
                
            });
        })
    }
    else {
        res.send(req.body)
    }
})

router.post('/check/:id', (req, res) => {
    let date = moment(req.body.date).toDate()
    // let userId = req.session.currentUser._id
    let habitId = req.params.id;

    console.log('Hit habits/check/:id');

    let debugObj = {};

    if(habitId) {
        Habit.findByIdAndUpdate( habitId,
            { $push: { date_data: date} },
            { new: true },
            (err, updatedHabit)=> {
                //res.send(updatedHabit)
                User.findById(updatedHabit.userRef, (err,foundUser)=>{
                    
                    let origIndex = foundUser.habit_list.findIndex( (e)=> {
                        return e._id.equals(updatedHabit._id);
                    })

                    debugObj['origIndex'] = origIndex;
                    debugObj['hablist'] = foundUser.habit_list;
                    debugObj['updatedHab'] = updatedHabit;

                    foundUser.habit_list.id(habitId).remove();
                    

                    updatedHabit.date_data.sort( (a,b) => {
                            if(moment(a).isBefore(b, 'day')) {return -1}
                            if(moment(a).isAfter(b, 'day')) {return 1}
                            return 0;
                    })
                    console.log('Inserting at: '+origIndex);
                    foundUser.habit_list.splice(origIndex,0,updatedHabit);
                    //foundUser.habit_list.push(updatedHabit);
                    
                    foundUser.save((err,data)=>{
                        if(err) {res.send(err)}
                        else { res.send(debugObj)}
                    })
                })
            }  
        )
    }
    //res.send(req.body)
})

router.get('/allData', (req,res) => {
    let userId = req.session.currentUser._id

    User.findById(userId, (err, foundUser)=> {
        res.send(foundUser.habit_list);
    })
})

////////////////////////////////////////////////
///         Display a Month of Habit Data
////////////////////////////////////////////////

router.get('/month/:id', (req, res) => {
    let habitId = req.params.id;
    let displayMonth = req.query.month;

    Habit.findById( habitId, (err, foundHabit) => {
        let filteredDates = foundHabit.date_data.filter( (date) => {
            if (parseInt(moment(date).month()) === parseInt(displayMonth)) {
                return true 
            }
            else { return false }
        });

        sortDateData(filteredDates);

        res.send(filteredDates)
    });
});


////////////////////////////
///     Help Methods
////////////////////////////

const sortDateData = (dateArr) => {

    dateArr.sort( (a,b) => {
        if(moment(a).isBefore(b, 'day')) {return -1}
        if(moment(a).isAfter(b, 'day')) {return 1}
        return 0;
    })
};