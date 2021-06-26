const { Router } = require('express')
const router = Router()
const authServices = require('../services/authServices')
const { COOKIE_NAME } = require('../config/config')


router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {

    const { username, password, repeatPassword } = req.body

    if (password != repeatPassword) {
        throw new Error('password should match!')
    }

    authServices.register({ username, password }).then(data => {
        res.render('login')
    }).catch(error => {
        console.log(error)
        res.render('register', { error: error.errors.username })
    })



})
router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login', (req, res) => {
    const { username, password } = req.body
    authServices.login({ username, password })
        .then(token => {
            res.cookie(COOKIE_NAME, token)
            res.redirect('/')
        }).catch(error => {
            res.render('login', { error })
        })

})
router.get('/create', (req, res) => {
    res.render('create')
})
router.post('/create', (req, res) => {
    const { title, description, imageUrl, isPublic } = req.body
    const createAt = new Date()
    const ownerId = req.user._id
    let Public = isPublic == 'on'
    const courseObject = {
        title,
        description,
        imageUrl,
        Public,
        createAt,
        ownerId,
    }

    authServices.create(courseObject).then(data => {
        res.redirect('/')
    }).catch(error => {
        res.render('create', { error })
    })


})
router.get('/:id?/details', (req, res) => {
    authServices.getOne(req.params.id).then(data => {
        itsOwner = req.user._id == data.ownerId
        itsEnroll = data.userEnrolled.find(x => x == req.user._id)
        res.render('details', {
            data: data,
            itsOwner,
            itsEnroll,
        })
    })
})
router.get('/:id?/edit', (req, res) => {
    authServices.getOne(req.params.id).then(data => {
        res.render('edit', { data })
    })
})
router.post('/:id?/edit', (req, res) => {

    const { title, description, imageUrl, isPublic } = req.body
    const createAt = new Date()
    const ownerId = req.user._id
    let Public = isPublic == 'on'
    const courseObject = {
        title,
        description,
        imageUrl,
        Public,
        createAt,
        ownerId,
    }

    authServices.updateCourse(req.params.id, courseObject).then(data => {
        res.redirect(`/auth/${req.params.id}/details`)
    }).catch(error => {
        res.render('details', error)
    })
})
router.get('/:id?/enroll', (req, res) => {

    let courseId = req.params.id
    let userId = req.user._id
    authServices.Enrolled(userId, courseId).then(data => {
        res.redirect(`/auth/${courseId}/details`)
    })

})
router.get('/:id/delete', (req, res) => {

    authServices.deleteOne(req.params.id).then(data => {
        res.redirect('/')
    })
})



module.exports = router