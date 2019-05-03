const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Schema = mongoose.Schema
const userSchema = new Schema({
    fullname: {
        type: String,
        minlength: [4, 'fullname is short'],
        required: [true, 'fullname is required']
    },
    username: {
        type: String,
        unique: true,
        minlength: [4, 'username is short'],
        required: [true, 'username is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return "email is invalid"
            }
        }
    },
    password: {
        type: String,
        minlength: [6, 'password is too short'],
        maxlength: [128, 'password is too long'],
        required: [true, 'password is required']
    },
    passUpdate: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    roles: {
        type: [String],
        default: 'employee'
    },
    allowAccess: {
        type: Boolean,
        default: true
    }
})

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

//before saving
userSchema.pre("save",function(next){
    const user = this
    if(user.passUpdate){
        encryptPassword = () => {
            return bcrypt.genSalt(10)
                .then(function(salt){
                    return bcrypt.hash(user.password,salt)
                        .then(function(encPass){
                            user.password = encPass
                            user.passUpdate = false
                        })
                })
        }
        setRole = () => {
            return User.countDocuments()
                .then(function(count){
                    if(count == 0){
                        user.roles = ["admin"]
                    }
                })
        }
        return Promise.all([encryptPassword(),setRole()])
            .then(function(values){
                next()
            })
            .catch(function(err){
                return Promise.reject(err.message)
            })
    }else{
        next()
    }    
})

//staic methods
userSchema.statics.findByCredentials = function(username_email,password) {
    const User = this
    return User.findOne({$or:[{email: username_email},{username: username_email}]})
            .then(function(user){
                if(!user){
                    return Promise.reject("invalid credentials")
                }
                else{
                    return bcrypt.compare(password,user.password)
                        .then(function(result){
                            if(!result){
                                return Promise.reject("invalid credentials")
                            }else{                                
                                if(user.allowAccess){
                                    return Promise.resolve(user)
                                }else{
                                    return Promise.reject("access denied")
                                }
                            }
                        })
                }                
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}
userSchema.statics.findByToken = function(token) {
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token,"expense@jwt123")
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        "tokens.token": token
    })
}

//instance methods
userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        _id: user.id,
        username: user.username,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData,"expense@jwt123")
    user.tokens.push({
        token
    })
    return user.save()
        .then(function(user){
            return Promise.resolve({roles: user.roles, token, id: user._id})
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}
userSchema.methods.updatePassword = function() {
    const user = this
    return user.save()
        .then(function(user){
            return Promise.resolve(user)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}

const User = mongoose.model("User",userSchema)
module.exports = {
    User
}

