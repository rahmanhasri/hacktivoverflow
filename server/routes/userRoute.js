const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLogin } = require('../middlewares/middleware')

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/tag', isLogin, userController.getTag)

router.patch('/tag/:name', isLogin, userController.subscribeTag);

router.get('/', userController.checkUsers);


module.exports = router