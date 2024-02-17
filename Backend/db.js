const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:Rishu571%40@cluster0.p1xqoww.mongodb.net/PaytmApp')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLenght: 3,
        maxLenght: 30
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLenght: 40
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLenght: 40
    },
    password: {
        type: String,
        required: true,
        minLenght: 6
    }
});


const User = mongoose.model('User', userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // referecne to User table
        required: true
    },
    balance: {
        type : Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
};