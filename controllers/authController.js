const { HttpError } = require("../helpers/HttpError");
const { schemas, User } = require("../models/user");
// пакет для хеширования пароля
const bcrypt = require("bcrypt")
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

    // Проверяем, что данные соответствуют схеме
    const { error } = schemas.registerSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Создаем нового пользователя в базе данных
    const newUser = await User.create({ ...req.body, password: hashPassword });

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
// если пароль совпал, создаем токен и отправляем!
const token = "vdvxaxxsxqq.c4fdrrf444f.vjjbv89"

res.json({token})

}

module.exports = {
  register
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