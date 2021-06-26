const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { SALT } = require('../config/config')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    enrolledCourse: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    }],

})

userSchema.pre('save', function (next) {
    bcrypt.genSalt(SALT)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash
            next()
        })
})

module.exports = mongoose.model('User', userSchema);