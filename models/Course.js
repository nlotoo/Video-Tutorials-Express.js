const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
    },
    imageUrl: {
        type: String,
        required:true,
        validate: /^https?/,
    },
    Public: {
        type: Boolean,
    },
    createAt: {
        type: Date,
    },
    ownerId: {
        type: String
    },
    userEnrolled: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]

})


module.exports = mongoose.model('Course', courseSchema);