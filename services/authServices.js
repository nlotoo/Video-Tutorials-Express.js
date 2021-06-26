const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/config')
const bcrypt = require('bcrypt')
const Course = require('../models/Course')


const register = (user) => {

    return User.create(user)
    // .then(data => {
    //     let token = jwt.sign({ _id: data._id, username: data.username }, SECRET)
    //     return token
    // })

}
const login = ({ username, password }) => {

    let user = User.findOne({ username: username })
        .then(user => {
            if (!user) {
                throw new Error('Invalid username and pass')
            }
            return bcrypt.compare(password, user.password)
                .then(areEqual => {
                    if (!areEqual) {
                        throw new Error('wrong pass')
                    }
                    let token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, SECRET)
                    return token
                })

        })
    return user
}
const create = (courseObject) => {
    return Course.create(courseObject)
}
const getAll = () => {
    return Course.find({}).lean()
}
const getOne = (id) => {
    return Course.findOne({ _id: id }).lean()
}
const updateCourse = (id, data) => {
    return Course.updateOne({ _id: id }, data)
}
const Enrolled = (userId, courseId) => {
    return Course.findOne({ _id: courseId }).then(CourseResult => {
        CourseResult.userEnrolled.push(userId)
        return CourseResult.save()
    })

}
const deleteOne = (courseId) => {
    return Course.deleteOne({ _id: courseId })
}

const getTop3OutLoginUser = () => {
    return Course.find({}).sort({ userEnrolled: -1 }).lean()
}
// ДА НАПРАВЯ ТЪРСАЧКАТА
const getTop3LogedUser = (query) => {
    return Course.find({}).sort({ createAt: -1 }).lean().then(data => {
        let result = data.sort(x => x.title.toLowerCase().includes(query))
        return result 
    })
}

module.exports = {
    register,
    login,
    create,
    getAll,
    getOne,
    updateCourse,
    Enrolled,
    deleteOne,
    getTop3OutLoginUser,
    getTop3LogedUser,
}