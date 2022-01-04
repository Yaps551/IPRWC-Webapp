 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');

 const jwtGenerator = require('../config/jwt');
 
 const User = require('../models/user');

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({
        where: {
            email: email
        }
    })
    .then(user => {
        if (!user) {
            return res.status(401);
        }

        loadedUser = user;
        return bcrypt.compare(password, user.password)
        .then(isEqual => {
            if (!isEqual) {
                return res.status(401);
            }
            // Generate tokens
    
            const token = jwtGenerator.generateAccessToken({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            });

            res.cookie("Token", token, {
                secure: false, // FIXME set to true for HTTPS
                httpOnly: true
            });

            res.send();
        });
    })
    .catch(err => {
        return res.status(500);
    })
};

exports.postLogout = (req, res, next) => {
    res.clearCookie("Token");

    res.status(200).json({ message: "Logged out successfully" });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    })
    .then(existingUser => {
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already in use'
            });
        }
        // Hash password
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword
            });

            return user.save()
        })
        .then(() => {
            res.status(201).json({
                message: 'Signed up succesfully'
            });
        });
    })
    .catch(err => {
        console.log(err);
    });
};