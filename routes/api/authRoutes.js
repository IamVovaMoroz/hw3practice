// const express = require('express')

// const ctrl = require('../../controllers/auth')




// const {schemas} = require('../../models/user')

// const router = express.Router()

// // маршрут для регистрации /api/auth/register прописываем только register т.к.  api/auth в app. можно писать так  router.post('/signup')
// // при роуте используем схему и при выполнении используем контролер ctrl.register
// router.post('/register', schemas.registerSchema, ctrl.register )

// module.exports = router






// const express = require('express');
// const authController = require('../../controllers/index');
// const { schemas } = require('../../models/user');


// const router = express.Router();




// // Маршрут для регистрации /api/auth/register
// // При роуте используем схему и при выполнении используем контролер ctrl.register
// router.post('/register', schemas.registerSchema, authController.register);

// module.exports = router;

// const express = require('express');
// const authController = require('../../controllers/authController'); // Убедитесь, что путь указан правильно
// const { schemas } = require('../../models/user');

// const router = express.Router();

// // Маршрут для регистрации /api/auth/register
// // При роуте используем схему и при выполнении используем контролер authController.register
// router.post('/register', schemas.registerSchema, authController.register);

// module.exports = router;
const express = require('express');
const authController = require('../../controllers/authController');
// const { schemas } = require('../../models/user');

const router = express.Router();

// Маршрут для регистрации /api/auth/register
// При роуте используем схему и при выполнении используем контролер authController.register
router.post('/register', (req, res) => {
  authController.register(req, res);
});

// Login

router.post('/login', (req, res) => {
    authController.login(req, res);
  });

module.exports = router;



