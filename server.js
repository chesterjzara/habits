
//Express setup
const express = require('express');
const app = express();

//Moment.js
const moment = require('moment');
app.locals.moment = moment;

// Port and Database Config
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/'+ `habits`;

//Listener
app.listen(PORT, () => {
    console.log(`Listening on port ` + PORT + `...`);
})

// Dependencies
const mongoose = require('mongoose');
const db = mongoose.connection;

//Models
const User = require('./models/users.js');
const Habit = require('./models/habits.js');
const Task = require('./models/tasks.js');



// Connect to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true}, () => {
    console.log('the connection with mongod is established')
})
// Connection Error/Success - optional but can be helpful
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//////////////////////////
//      Middleware
/////////////////////////
//Serve Favicon Request
let favicon = require('serve-favicon');
// var path = require('path');
// app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(favicon('./public/favicon.ico'));


//Static File access
app.use(express.static('public'));  //eg: '/css/app.css'

//Parse req.body from forms
app.use(express.urlencoded({extended:false}));
//Needed for parsing json requests: app.use(express.json());

//Method override - allow DELETE, PUT from forms
const methodOverride  = require('method-override');
app.use(methodOverride('_method'));

//Express-sessions to track user sessions
const session = require('express-session');
app.use(session({
    secret: "sessionsecret",
    resave: false,
    saveUninitialized: false
}))

//Flash messages
const flash = require('connect-flash');
app.use(flash());

///////////////////////
//      Routes
///////////////////////

//Test
app.get('/' , (req, res) => {
    res.render('index.ejs', {
        currentUser: req.session.currentUser
    });
});

app.get('/test' , (req, res) => {
    User.find({}, (err,foundUsers) => {
        res.send(foundUsers)
    })
    
});


//Authentication Routes
const authController = require('./controllers/auth_controller.js');
app.use('/auth', authController);

//User Routes
const userController = require('./controllers/users_controller.js');
app.use('/users', userController);

//Sessions Routes
const sessionController = require('./controllers/sessions_controller.js');
app.use('/sessions', sessionController);

//Habits Routes
const habitController = require('./controllers/habits_controllers.js');
app.use('/habits', habitController);


//New 
//Create 
//Index 
//Show 
//Destroy 
//Edit 
//Update

app.get('/seeding/user', (req, res) => {
    let seedData = [
        {
            date_data: [ ],
            name: "Pushups",
            description: "Do pushups each day!",
            tag: "Fitness"
        },
        {
            date_data: [ ],
            name: "Run",
            description: "Go for a job",
            tag: "Fitness"
        },
        {
            date_data: [ ],
            name: "Eat healthy",
            description: "No sugar, good vegetables!",
            tag: "Health"
        },
        {
            date_data: [ ],
            name: "Take medicine",
            description: "Spoon full of sugar...",
            tag: "Health"
        }
    ];
    User.findOne({username: 'test'}, (err, foundUser)=>{
        Habit.insertMany(seedData, (err, addedHabits) => {
            
            for(let i=0; i < addedHabits.length; i++) {
                console.log(addedHabits[i]);
                console.log(foundUser);
                foundUser.habit_list.push(addedHabits[i])
                if(foundUser.tag_list.indexOf(addedHabits[i].tag) === -1){
                    foundUser.tag_list.push(addedHabits[i].tag)
                }
            }
            foundUser.save( (err,savedUser)=> {
                res.send(savedUser);
            })
        })
    })
})

app.get('/currentUser', (req,res)=> {
    res.send(req.session);
})

//Testing DB Setup:

// User.create({
//     username: "CJZ",
//     password: "test",
//     displayName: "CJ"
// }, (err,createdUser) => {
//     console.log(createdUser);
//     Habit.create({
//         userRef: createdUser.id,
//         habitName: "Brushing Teeth",
//         notes: "Do 3 times daily!",
//     }, (err,newHabit) => {
//         if(err) {console.log(err);}
//         createdUser.habitList.push(newHabit)
//         createdUser.save((err,newSavedUser)=>{
//             console.log('After Habit add attempt');
//             console.log(newHabit);
//             console.log('Orig User');
//             console.log(createdUser);
//             console.log('Updated user');
//             console.log(newSavedUser);
//         })
        
//     });
// });