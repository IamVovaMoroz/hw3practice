// app.js
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
// импортируем dotenv 
const dotenv = require('dotenv')
const contactsRouter = require('./routes/api/contactsRoutes')

// вызываем можно 1 строкой require(dotenv).config() который берёт данные с .env и добавляет их в process.env записывает ключ и значение
dotenv.config()


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
// для ограничения доступа
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
