// Imports
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models");
const asyncLib = require("async");

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
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

    if (username.length >= 15 || username <= 4) {
      return res
        .status(400)
        .json({ error: "Wrong username (must be length 4-15)" });
    }

    // Regex

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "email is not valid" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error:
          "password invalid (must length 4-8 and include at least one numeric digit",
      });
    }

    models.User.findOne({
      attributes: ["email"],
      where: { email },
    }).then(function (userFound) {
      if (!userFound) {
        bcrypt.hash(password, 5, function (err, bcryptedPassword) {
          return models.User.create({
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
              return res.status(201).json(newUser);
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

    if (!email || !password) {
      return res.status(400).json({ error: "missing parameters" });
    }

    // Regex

    models.User.findOne({
      where: { email: email },
    })
      .then(function (userFound) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function (
            errBycrypt,
            resBycrypt
          ) {
            if (resBycrypt) {
              return res.status(200).json({
                userId: userFound.id,
                token: jwtUtils.generateTokenForUser(userFound),
              });
            } else {
              return res.status(403).json({ error: "invalid password" });
            }
          });
        } else {
          return res.status(400).json({ error: "user not exist in Database" });
        }
      })
      .catch(function (err) {
        return res.status(500).json({ error: "unable to verify user" });
      });
  },

  getUserProfile: function (req, res) {
    // Getting auth header
    const headersAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headersAuth);

    if (userId < 0) return res.status(401).json({ error: "wrong token" });

    models.User.findOne({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
        "birthday",
        "city",
        "bio",
      ],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch user " });
      });
  },

  getUsers: function (req, res) {
    models.User.findAll().then(function (user) {
      console.log("All users");
      console.log(user);
      res.status(201).json(user);
    });
  },

  //TO DO IMPORTANT

  updateUserProfile: function (req, res) {
    const data = req.body;
    const id = req.params.userId;
    console.log(data);
    const updateUser = models.User.update(data, { where: { id } });
    if (updateUser) {
      const tutu = models.User.findOne({
        where: { id },
      }).then(function (user) {
        res.status(201).json(user);
      });
    }
  },

  deleteUserProfile: function (req, res) {
    const id = req.params.userId;
    try {
      const deleteUser = models.User.destroy({ where: { id } });
      res.status(201).json({ succes: `Profil deleted` });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};
