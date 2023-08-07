// const { HttpError } = require("../helpers/HttpError");
const { schemas, User } = require("../models/user");
const jwt = require('jsonwebtoken')
const path = require('path');
// для временной аватарки
const gravatar = require('gravatar')
// используем fs для перемещения
const fs = require('fs/promises')

// пакет для хеширования пароля
const bcrypt = require("bcrypt")

const {SECRET_KEY} = process.env

const avatarDir = path.join(__dirname, '../', 'public', 'avatars')

// console.log(SECRET_KEY)
const register = async (req, res) => {
  try {
    // Получаем данные пользователя из тела запроса
    const { email, password } = req.body;

    // перед регистрацией смотрим есть ли с таким email уже
    const user  = await User.findOne({email})
// если есть имейл такой уже, выводим сообщение "Email already in use"
if (user) {
  return res.status(409).json({ message: "Email already in use" });
}

const hashPassword = await bcrypt.hash(password, 10)

// передаем email человека и мы получаем аватар начальный
const avatarURL = gravatar.url(email)

    // Проверяем, что данные соответствуют схеме
    const { error } = schemas.registerSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Создаем нового пользователя в базе данных с аватаркой
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL  });

    // Отправляем успешный ответ с данными о новом пользователе и статус 201 добавляем
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription
      }
    });
  } catch (error) {
    // В случае ошибки логируем ее и отправляем ответ с кодом 500 и сообщением об ошибке
  
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {

  const { email, password } = req.body;

 // перед залогинется смотрим есть ли с таким email уже
 const user  = await User.findOne({email})
// если пользователя по email не находит - ошибка
 if(!user){
  return res.status(401).json({ message: "Email or password invalid" });
}
// если есть пользователь в базе по email, сравниваем пароль его с тем что в базе по хешированию
const comparePassword = await bcrypt.compare(password, user.password)

if(!comparePassword){
  return res.status(401).json({ message: "Email or password invalid" });
}

// создаем токен payload данные user
const payload = {
  id: user._id,
  name: user.name,
  email : user.email,
}

const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"})

// сохраняем при login наш login  для последующего logout

await User.findByIdAndUpdate(user._id, {token})

// если пароль совпал, создаем токен и отправляем!
// console.log(token)

res.json({token})

}
// получаем email, name из req.user и отправляем их
const getCurrent = async (req, res) => {
  const {email, name} = req.user;
// const {email, name, id} = req.user;
// console.log("Email:", email);
// console.log("Name:", name);
// console.log("id:", id);
res.json({email, name})
}

const logout = async (req, res) => {

  const {_id} = req.user;
// при logout делаем token: ""
  await User.findByIdAndUpdate(_id,  {token: ""})

  res.json({message: "Logout success"})
}

const updateAvatar = async (req, res) => {
  const {_id} = req.user
// импортируем путь и название
  const { path: tempUpload, originalname } = req.file


// импортируем где будет сохраняться 
const resultUpload = path.join(avatarDir, originalname)
// перемещаем , указывая старое и новое место с fs.rename
await fs.rename(tempUpload, resultUpload)
// Записываем новый путь в базу. получаем ид и отправляем новый путь к avatarURL
const avatarURL = path.join('avatars', originalname)
await User.findByIdAndUpdate(_id, {avatarURL})
// отправляем
res.json(avatarURL)
}

module.exports = {
  // register: register
  register,
  login,
  getCurrent,
  logout,
  updateAvatar
}


// // пакет для хеширования пароля
// const bcrypt = require("bcrypt")


// const createHashPassword = async(password) =>{
//   const salt = await bcrypt.getSalt(10)
// console.log('salt', salt)
//   const result = await bcrypt.hash(password, 10)
//   console.log('result', result)
 
// // передаем не нешированную и хишированную строку, если compreResult1 соответствует - true
//   const compreResult1 = await bcrypt.compare(password, result)
//   const compreResult2 = await bcrypt.compare("password1", result)
//   console.log('compreResult1', compreResult1)
//   console.log('compreResult2', compreResult2)
// }

// createHashPassword("123456")

// const jwt = require('jsonwebtoken')

// // строка дляшифрования
// require('dotenv').config()
// // берем строку SECRET_KEY из env ( SECRET_KEY="StrongK3yW!thSpec!alCharacters2023"  )
// const {SECRET_KEY} = process.env

// // payload(инфо про пользователя) - ID пользователя чаще всего

// const payload = {
//     id: "64ba88293eef33a1f61632e7"
// }
// // данные пользователя payload + SECRET_KEY + обьект настроек expiresIn: "23h" время жизни токена
// //  1 часть токена закодир заголовок, 2 часть закодированный payload + 3 часть все это закодированное секретным ключём
// const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"})

// console.log(token)

// // раскодируем токен , записываем в переменную jwt с методом decode , вставляя туда токен

// const decodeToken = jwt.decode(token)
// console.log(decodeToken)

// // проверяем токен от фронтэнда/ Проверит шифровали ли мы токен этим секретным ключем и не закончился ли срок действия. id - payload
// try {
//     const {id} = jwt.verify(token, SECRET_KEY)
//     console.log(id)
//     // проверим токен не шифрованный секретным ключем 1) ошибка при не верном токене обшибка 401
//     // const invalidToken = '!eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YmE4ODI5M2VlZjMzYTFmNjE2MzJlNyIsImlhdCI6MTY5MDU0NzA0OSwiZXhwIjoxNjkwNjI5ODQ5fQ.mMV4dMNwisWhzzvD2dJ_rrLtVBnO3pUSeolDENgkVas'
//     // const badResult = jwt.verify(invalidToken, SECRET_KEY)
// // проверим верный токен 
// const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YmE4ODI5M2VlZjMzYTFmNjE2MzJlNyIsImlhdCI6MTY5MDU0NzA0OSwiZXhwIjoxNjkwNjI5ODQ5fQ.mMV4dMNwisWhzzvD2dJ_rrLtVBnO3pUSeolDENgkVas'
// const goodResult = jwt.verify(validToken, SECRET_KEY)

// }catch(error){
//     console.log(error.message)
// };