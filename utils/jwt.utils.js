// imports
const jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET =
  "gludyld6dg9jkhjk44kj7k7df67gf4gf6g4re35g4fd4gf5d6gfd53g4f3f435fs";

//exported functions

module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: "12h",
      }
    );
  },
  parseAuthorization: function (authorization) {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  getUserId:  function (authorization) {
    let userId = -1;
    const token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        const jwtToken =  jwt.verify(token, JWT_SIGN_SECRET);
        console.log("jwt", jwtToken);
        if (jwtToken != null) {
          
           userId = jwtToken.userId
          return userId;
        }
      } catch (err) {
      }
    }
    return userId;
  },
};
