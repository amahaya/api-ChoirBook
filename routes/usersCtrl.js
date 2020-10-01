// Imports
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models");

// Routes
module.exports = {
  register: function (req, res) {
    //Params
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const birthday = req.body.birthday;
    const city = req.body.city;
    const picture = req.body.picture;
    const bio = req.body.bio;
    console.log(req.body);

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !birthday ||
      !city
    ) {
      // === if (email === null || username === null || ...)
      return res.status(400).json({ error: "Missing parameter" });
    }

    //TO DO Regex

    models.User.findOne({
      attributes: ["email"],
      where: { email },
    }).then(function (userFound) {
        if (!userFound) {
        bcrypt.hash(password, 5, function (err, bcryptedPassword) {
          models.User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: bcryptedPassword,
            birthday: birthday,
            city: city,
            picture: picture,
            bio: bio,
            isAdmin: 0,
          })
            .then(function (newUser) {
              return res.status(201).json(
                newUser
              );
            })
            .catch(function (err) {
              return res.status(500).json({ error: "cannot add user" });
            });
        });
      } else {
        return res.status(409).json({ error: "user already exist" });
      }
    });
  },

  login: function (req, res) {
    //Params
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password ) {
        return res.status(400).json({'error':'missing parameters'});
  }

      //TO DO Regex

      models.User.findOne({
          where: { email: email}
      })
      .then(function(userFound) {
          if (userFound) {
              bcrypt.compare(password,userFound.password, function(errBycrypt, resBycrypt) {
                  if(resBycrypt){
                      return res.status(200).json({
                          'userId': userFound.id,
                          'token': jwtUtils.generateTokenForUser(userFound)
                      });
                  } else {
                      return res.status(403).json({"error":"invalid password"});
                  }
              }
              )

          } else {
              return res.status(400).json({'error': 'user not exist in Database'});
          }
      })
      .catch(function(err) {
          return res.status(500).json ({'error': 'unable to verify user'});
      });
    }
}
