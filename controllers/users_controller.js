const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users.js');

//New GET 
router.get('/new', (req,res) => {
    res.render('users/new.ejs', {
        messages: req.flash('info'),
        currentUser: req.session.currentUser
    })
});

//Show User
router.get('/:id', (req,res) => {
    res.render('users/show.ejs', {
        currentUser: req.session.currentUser
    })
})

//Create POST - New User Account
router.post('/', (req,res) => {
    
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    
    User.create(req.body, (err, createdUser)=> {
        if(err) {
            console.log(err);
            if(err.code === 11000) {
                req.flash('info', 'Duplicate username, unable to create account')
                res.redirect('/users/new');
            } else {
                req.flash('info', 'Unable to create account')
                res.redirect('/users/new');
            }
        } else {
            //console.log(createdUser);
            res.redirect('/');
        }
    })
})

module.exports = router;