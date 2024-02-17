const express = require('express')
const zod = require('zod');
const {User, Account} = require('../db')
const {JWT_SECRET} = require('../config')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware')

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})


router.post('/signup',async(req,res) => {
    const {success} = signupSchema.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser) {
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }) 

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "user created successfully",
        token: token
    })
})

const signinSchema = zod.object({
    username: zod.string().email().min(3).max(30),
    password: zod.string().min(6)
})

router.post('/signin', async(req,res) => {
    const body = req.body;

    const {success} = signinSchema.safeParse(body);

    if(!success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const username = req.body.username;
    const password = req.body.password;

    const user = User.find({
        username: username,
        password: password
    })

    if(user) {
        const token = jwt.sign({
            userId : User._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})

// Step: 8 -- Updating user information

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/", authMiddleware, async(req,res) => {
    const {success} = updateBody.safeParse(req.body)
    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    // confusion in secodn parameter of updateone
    await User.updateOne(req.body, {
        _id: req.userId
    })

    res.json({
        message: "updated successfully"
    })
})


router.get("/bulk", async(req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex" : filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


router.get("/balances", authMiddleware, async(req,res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});



module.exports = router;

