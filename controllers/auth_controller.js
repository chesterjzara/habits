const express = require('express')
const router = express.Router();

//auth login screen
router.get('/login', (req,res) => {
    res.render('login.ejs');
})

//logging out
router.get('/logout', (req,res) => {
    //passport will do this
    res.send('logging out')
})

//auth with google
router.get('/google', (req,res)=> {
    
    //done by passport
    res.send('log in with google');
})

module.exports = router;