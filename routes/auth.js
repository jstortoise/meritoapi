const express = require('express');
const router = express.Router();
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AdminClient = require('../lib/adminClient');

let adminClient = new AdminClient({
    realm: 'demo',
    serverUrl: 'http://localhost:8080',
    resource: 'meritocracy',
    adminLogin: 'test1',
    adminPassword: 'test'
});

// Register
router.post('/register', function(req, res, next){
    let newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, function(err, user){
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register user'
            });
        } else {
            res.json({
                success: true,
                msg: 'User registered'
            });
        }
    });
});

// Authenticate
router.post('/login', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                msg: 'User not found'
            });
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });

                // First We need a token
                // request.post({ url: keycloak.baseUrl + keycloak.tokenUrl, form: keycloak.config }, function (err, res, body) {
                //     if (err) {
                //         console.log(err);
                //         return;
                //     }
                //     var jsonBody = JSON.parse(body);
                //     var accessToken = jsonBody.access_token;
                
                //     var auth = {
                //         bearer: accessToken
                //     };
                
                //     request.post({
                //         url: `${keycloak.baseUrl}/admin/realms/demo/users`,
                //     }, function (err, response, body) {
                //         if (err) {
                //             console.log(err);
                //             return;
                //         }
                //     });
                // });
                adminClient.createTestUser();
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        });

    });
});

module.exports = router;