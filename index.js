require('dotenv').config()

const Entry = require('./models/mongoose')

const express = require('express')
const cors = require('cors')

const translate = require('@vitalets/google-translate-api')

const app = express()
app.use(cors())
app.use(express.json())

const entries = Entry.find({})

app.get('/', (req, res) => {
  res.send(
    `<h2>Wordbook API Root Endpoint</h2>
     <p>The API is <a href='./api/words'>here.</a></p>
    `)
})

app.get('/api/words', (req, res) => {
    entries
      .then(r => res.json(r))
})

app.get('/api/words/:id', (req, res, next) => {
  Entry
    .findById(req.params.id)
    .then(r => {
      if (r) {
        res.json(r)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/words', (req, res) => {
  const body = {
    de: req.body.de
  }

  translate(body.de, {from: 'de', to: 'en'})
    .then(r => {
      body.en = r.text

      translate(body.de, {from: 'de', to: 'ru'})
        .then(r => {
          body.ru = r.text
               
          const entry = new Entry({
            de: body.de,
            en: body.en,
            ru: body.ru,
          })

          entry
            .save()
            .then(r => res.json(r))
        })
    })
})


app.delete('/api/words/:id', (req, res, next) => {
  Entry
    .findByIdAndRemove(req.params.id)
    .then(r => res.status(204).end())
    .catch(err => next(err))
})


//edge case handlers

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name ==='CastError') {
    return res.status(400).send({ error: 'malformed id' })
  }

  next(err)
}

app.use(errorHandler)

/*
let words = [
    {
      id: 1,
      art: 'das',
      de: 'Buch',
      en: 'Book',
      ru: 'Книга'
    },
    {
      id: 2,
      art: 'das',
      de: 'Fehrrad',
      en: 'Bicycle',
      ru: 'велосипед'
    },
    {
      id: 3,
      art: 'das',
      de: 'Glied',
      en: 'Peis',
      ru: 'Член (п.)'
    }
  ]
*/

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})