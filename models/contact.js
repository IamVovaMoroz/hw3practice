const { model, Schema } = require('mongoose')

// создаем схему
const contactSchema = new Schema({
  type: String,
  required: [true, 'Set name for contact'],
  email: {
    type: String
  },
  phone: {
    type: String
  },
  favorite: {
    type: Boolean,
    default: false
  }
})

// создаем модель 'Contact' - название колекции в един. числе

const Contact = model('Contact', contactSchema)
// экспортируем и импортируем в контролер
module.exports = Contact
