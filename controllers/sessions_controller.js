const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users.js');

//New Session
router.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        messages: req.flash('info'),
        currentUser: req.session.currentUser
    });
});

//Checks if password is correct on login
    //if correct, save a currentUser property in the req.session
router.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser)=>{
        if(err) {console.log(err);}
        
        if(!foundUser) {
            req.flash('info', 'Username not found')
            res.redirect('/sessions/new');
            
        } else {
            if(bcrypt.compareSync(req.body.password, foundUser.password) ){
                req.session.currentUser = foundUser;
                res.redirect('/');
            } else {
                req.flash('info', 'Incorrect password')
                res.redirect('/sessions/new');
            }
        }
        
        
    });
});

// Triggered by logout button
    //"destroy" the current session aka log out
router.delete('/', (req,res) => {
    req.session.destroy((err)=> {
        res.redirect('/');
    });
});



module.exports = router;