"use strict";
const faker = require("faker");

const generateUsers = (usersCount) => {
  let users = [];

  for (let index = 0; index < usersCount; index++) {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      birthday: faker.date.past(),
      city: faker.address.city(),
      picture: faker.image.avatar(),
      bio: faker.lorem.sentence(),
      isAdmin: faker.random.boolean(false),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(user);
  }

  return users;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed
     */
    await queryInterface.bulkInsert(
      "Users", //database table's name !!
      generateUsers(150),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Revert seed.
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};



// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//   },

//   down: async (queryInterface, Sequelize) => {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };
