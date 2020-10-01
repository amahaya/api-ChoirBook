// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

// Routes
module.exports={
    register: function (req, res) {
        //Params
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const birthday = req.body.birthday;
    const city = req.body.city;
    const picture = req.body.picture;
    const bio = req.body.bio;

    if (!firstname||!lastname ||!username|| !email || !password || !birthday || !city) {
        // === if (email === null || username === null || ...)
        return res.status(400).json({ error: "Missing parameter" });
      }

      //TO DO Regex

      models.User.findOne({
          attributes: ['email'],
          where: { email: email}
      })
      .then (function(userFound) {
          if (!userFound) {
            bcrypt.hash(password,5,function(err,bcryptedPassword) {
                var newUser = models.User.create ({
                    firstname : firstname,
                    lastname : lastname,
                    username : username,
                    email : email,
                    password : bcryptedPassword,
                    birthday : birthday,
                    city : city,
                    picture : picture,
                    bio : bio,
                    isAdmin : 0
                })
                .then(function(newUser){
                    return res.status(201).json ({
                        'userId': newUser.id
                    })
                })
                .catch (function(err) {
                    return res.status(500).json ({ 'error': 'cannot add user' });
                });
            });
          } else {
              return res.status(409).json({'error': 'user already exist'});
          }
      })
    },

    login: function (req, res) {
        //TO DO
    }
}