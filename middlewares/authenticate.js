// // для проверки токена импортируем jsonwebtoken из библиотеки jsonwebtoken
// const jwt = require('jsonwebtoken')
// // для проверки шифровали ли 
// const {SECRET_KEY} = process.env
// // для провеки есть ли user с токеном в базе
// const {User} = require('../models/user')

// const authenticate = async (req, res, next) => {
//     // достаем данные из запроса
//   const { authenticate ="" } = req.headers
// // достаем данные bearer, token authenticate.split(" ") разделит bearer в bearer и token в токен
//   const [bearer, token] = authenticate.split(" ")
//   if(bearer !== "Bearer") {
// return res.status(401)
// // next (HttpError(401))  

//   }
//   try{
//     // проверяем токен обрабат ли секретн ключём
//     const {id} = jwt.verify(token, SECRET_KEY)
//     // проверяем кроме валидности токена есть ли человек ещё в базе
//     const user = await User.findById(id)
// if(!user){
//     // или токен написать не валидный или User нет такого или ошибку
//     return res.status(401)
// }
// // если всё хорошо то идём дальше
// next()
//   }catch{ return res.status(401)}
// }

// module.exports = authenticate

// const jwt = require('jsonwebtoken');
// const { User } = require('../models/user');

// const authenticate = async (req, res, next) => {
//   const { authenticate = "" } = req.headers;
//   const [bearer, token] = authenticate.split(" ");

//   if (bearer !== "Bearer") {
//     return res.status(401).json({ message: "Invalid token format" });
//   }

//   try {
//     const { id } = jwt.verify(token, process.env.SECRET_KEY);
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized user" });
//     }

//     // Если пользователь найден, сохраняем его в объекте запроса для последующего использования в других middleware или обработчиках маршрутов.
//     req.user = user;
//     next();
//   } catch (error) {
//     // Обработка ошибок при проверке токена или поиске пользователя
//     return res.status(401).json({ message: "Unauthorized user" });
//   }
// };

// module.exports = authenticate;
// const jwt = require('jsonwebtoken');
// const { User } = require('../models/user');

// const authenticate = async (req, res, next) => {
//   const { authenticate = "" } = req.headers;
//   const [bearer, token] = authenticate.split(" ");
//   console.log('bearer:', bearer);
//   console.log('token:', token);

//   if (bearer !== "Bearer") {
//     return res.status(401).json({ message: "Invalid token format" });
//   }

//   try {
//     const { id } = jwt.verify(token, process.env.SECRET_KEY);
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized user" });
//     }

//     // Если пользователь найден, сохраняем его в объекте запроса для последующего использования в других middleware или обработчиках маршрутов.
//     req.user = user;
//     next();
//   } catch (error) {
//     // Обработка ошибок при проверке токена или поиске пользователя
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: "Token has expired" });
//     } else if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: "Invalid token" });
//     } else {
//       return res.status(401).json({ message: "Unauthorized user" });
//     }
//   }
// };

// module.exports = authenticate;

// const jwt = require('jsonwebtoken');
// const { User } = require('../models/user');

// const authenticate = async (req, res, next) => {
//   console.log('Authenticate middleware started');

//   const { authenticate = "" } = req.headers;
//   console.log('authenticate header:', authenticate);

//   if (!authenticate) {
//     // Если заголовок authenticate отсутствует, это означает отсутствие аутентификации
//     console.log('No token provided');
//     // Дополнительный код обработки, если нужно
//     // Например, если вы хотите разрешить доступ к общедоступным маршрутам без токена
//     return next();
//   }

//   const [bearer, token] = authenticate.split(" ");
//   console.log('bearer:', bearer);
//   console.log('token:', token);

//   if (bearer !== "Bearer") {
//     console.log('Invalid token format');
//     return res.status(401).json({ message: "Invalid token format" });
//   }

//   // ... (остальной код authenticate)
// };

// module.exports = authenticate;

// // для проверки токена импортируем jsonwebtoken из библиотеки jsonwebtoken
// const jwt = require('jsonwebtoken')
// // для проверки шифровали ли 
// const {SECRET_KEY} = process.env
// // для провеки есть ли user с токеном в базе
// const {User} = require('../models/user')

const {SECRET_KEY} = process.env
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const authenticate = async (req, res, next) => {
  console.log('Authenticate middleware started');

  const { authenticate = "" } = req.headers;
  console.log('authenticate header:', authenticate);

//   const [bearer, token] = authenticate.split(" ");

  const bearer = "Bearer"
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzNjYWJlMzZkYmY5YTNlOGQ4MTU4OCIsImlhdCI6MTY5MDU2MDE4OSwiZXhwIjoxNjkwNjQyOTg5fQ.iE7fAHc8sc9VUHOiBmIJCNAS7FtCgjMKiFxGXRi8-FI"

  console.log('bearer:', bearer);
  console.log('token:', token);

  if (bearer !== "Bearer") {
    console.log('Invalid token format');
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Проверяем токен с помощью SECRET_KEY
    const { id } = jwt.verify(token, SECRET_KEY);
    console.log('Decoded user ID:', id);

    // Проверяем, что пользователь с таким ID существует
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: "Invalid token" });
    }

    // Если все проверки прошли успешно, пропускаем запрос дальше
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
