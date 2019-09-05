var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{

    req.session.login = null;
    res.redirect('/');
})

module.exports = router;