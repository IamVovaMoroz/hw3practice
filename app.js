// // app.js
// const express = require('express')
// const logger = require('morgan')
// const cors = require('cors')
// // ипортируем router авторизации
// const authRouter = require('./routes/api/authRoutes')

// const contactsRouter = require('./routes/api/contactsRoutes')

// const app = express()

// const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

// app.use(logger(formatsLogger))
// app.use(cors())
// app.use(express.json())

// // любой запрос на api/auth обрабатываем contactsRouter
// app.use('/api/auth', authRouter)

// app.use('/api/contacts', contactsRouter)

// app.use((req, res) => {
//   res.status(404).json({ message: 'Not found' })
// })

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message })
// })

// module.exports = app

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const authRouter = require('./routes/api/authRoutes') // Убедитесь, что путь указан правильно
const contactsRouter = require('./routes/api/contactsRoutes')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use('/users', authRouter); // Роутер для авторизации начинается с users
// app.use('/api/auth', authRouter) // Роутер для авторизации
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
