const { Router } = require('express')
const { COOKIE_NAME } = require('../config/config')
const router = Router()
const authServices = require('../services/authServices')

router.get('/', (req, res) => {
    console.log(req.query)
    let queryString = req.query.search
    if (req.user) {
        authServices.getTop3LogedUser(queryString).then(data => {
            res.render('home', { data })
        })
    } else {
        authServices.getTop3OutLoginUser().then(data => {
            res.render('home', { data })
        })
    }

})
router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME)
    res.redirect('/')
})




module.exports = router