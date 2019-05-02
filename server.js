
//Express setup
const express = require('express');
const app = express();


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
//const Model = require('./model.js');


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
//Static File access
app.use(express.static('public'));  //eg: '/css/app.css'

//Parse req.body from forms
app.use(express.urlencoded({extended:false}));
//Needed for parsing json requests: app.use(express.json());

//Method override - allow DELETE, PUT from forms
const methodOverride  = require('method-override');
app.use(methodOverride('_method'));

///////////////////////
//      Routes
///////////////////////

//Test
app.get('/' , (req, res) => {
    res.send('Hello World! on heroku');
});

//New 
//Create 
//Index 
//Show 
//Destroy 
//Edit 
//Update