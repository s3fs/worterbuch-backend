const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(r => console.log('Connected.'))
    .catch(err => console.log(err))

const entrySchema = new mongoose.Schema({
    de: String,
    en: String,
    ru: String,
    id: Number
})

entrySchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Entry', entrySchema)