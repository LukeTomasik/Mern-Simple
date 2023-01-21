const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// get all users
// get /users
// access private

const getAllUsers = asyncHandler(async (req,res) => {
    // select method -password -> gets info EXCEPT for password ( not needed to send back to FE)
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

// create new users
// post /users
// access private

const createNewUser = asyncHandler(async (req,res) => {

    const {username , password , roles} = req.body
    // confirming data

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()

    if(duplicate) return res.status(409).json({message: 'Duplicate username'}) 

    const hashedPwd = await bcrypt.hash(password, 10) //

    const userObject = {username, "password": hashedPwd, roles}

    // create and store new user
    const user = await User.create(userObject)

    if (user) {
        // created 
        res.status(201).json({message: `new User ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user Data'})
    }
})

// update User
// patch method
// access private

const updateUser = asyncHandler(async (req,res) => {
    const {id, username, roles, active, password} = req.body

    // confirm Data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        res.status(400).json({ message: 'all fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) return res.status(400).json({message: 'User not Found'})

    // check for duplicates

    const duplicate = await User.findOne({username}).lean().exec()

    // allow updates to the original user

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // hash password
        user.password = await bcrypt.hash(password, 10) //salt rounds
    }
    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated`})
})

// delete User
// delete method
// access private

const deleteUser = asyncHandler(async (req,res) => {

    const {id}= req.body

    if (!id) return res.status(400).json({ message: 'user ID required'})

    const note = await Note.findOne({ user:id}).lean().exec()
    if (note?.length) {
        return res.status(400).json({ message: 'user has assigned notes'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not Found'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {getAllUsers,createNewUser,updateUser,deleteUser}