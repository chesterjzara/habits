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
    let userId = req.session.currentUser._id

    User.findById( userId, (err, foundUser) => {
        // res.send(foundUser)
        res.render('users/show.ejs', {
            user: foundUser,
            currentUser: req.session.currentUser
        });
    });
});

//Edit User Route
router.get('/:id/edit', (req, res) => {
    let userId = req.params.id

    User.findById( userId, (err, foundUser) => {
        // res.send(foundUser)
        res.render('users/edit.ejs', {
            user: foundUser,
            currentUser: req.session.currentUser
        });
    });
});

router.put('/:id', (req,res) =>{
    let userId = req.params.id;

    User.findByIdAndUpdate( userId, req.body, {new:true}, (err, updatedUser) => {
        res.redirect(`/users/${userId}`);
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
    });
});

module.exports = router;