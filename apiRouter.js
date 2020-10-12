// Imports
const express  = require('express');
const usersCtrl = require('./routes/usersCtrl');
const messagesCtrl = require('./routes/messagesCtrl');

//Router
exports.router = (function() {
    const apiRouter = express.Router();

    // Users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/test/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/update/:userId').put(usersCtrl.updateUserProfile);

    apiRouter.route('/users/delete/:userId').delete(usersCtrl.deleteUserProfile);



    //Messages Routes
    apiRouter.route('/messages/new/').post(messagesCtrl.createMessage);
    apiRouter.route('/messages/').get(messagesCtrl.getMessage);
    apiRouter.route('/messages/update/:id').put(messagesCtrl.updateMessage)
    apiRouter.route('/messages/delete/:id').delete(messagesCtrl.deleteMessage);



    return apiRouter
})();