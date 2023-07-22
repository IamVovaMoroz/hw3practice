// const app = require('./app')

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })

// импортируем mongoose
const mongoose = require("mongoose")

const app = require('./app')
// const {DB_HOST} = require('./config')

// проложили путь с DB_HOST, находящегося в  https://dashboard.render.com/ => Environment
const {DB_HOST} = process.env

// настройки компа, где запускается проект https://dashboard.render.com/ => Environment  добавить изменяемое оркжение с компа данные
console.log(process.env.DB_HOST)


// подключаем по ссылке с mongoDB
// const DB_HOST = "mongodb+srv://VolodymyrM:{password}@cluster0.ls7r7f1.mongodb.net/db-contacts" переносим в config.js
// при обновлении чтобы не скинуло
mongoose.set('strictQuery', true)

// запуск сервера после успешно подсоединения к dataBase
mongoose.connect(DB_HOST).then(() => {
  console.log("Database connection successful");
  app.listen(3000)
})
.catch(error => {
  console.log("Database connection error:", error.message);
  // останавливает запущенный процесс в случае ошибки
  process.exit(1)
} )

