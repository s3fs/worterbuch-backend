const express = require('express')
const cors = require('cors')
const translate = require('@vitalets/google-translate-api')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(
    `<h2>Wordbook API Root Endpoint</h2>
     <p>The API is <a href='./api/words'>here.</a></p>
     <h4>Currently hosting ${words.length} listings.</h4>
    `)
})

app.get('/api/words', (req, res) => {
    res.json(words)
})

app.get('/api/words/:id', (req, res) => {
  const id = Number(req.params.id)

  res.json(words[id - 1])
})

app.post('/api/words', (req, res) => {
  const word = {
    de: req.body.de
  }

  translate(word.de, {from: 'de', to: 'en'})
    .then(r => {
      word.en = r.text

      translate(word.de, {from: 'de', to: 'ru'})
        .then(r => {
          word.ru = r.text
          
          word.id = words.length + 1
          
          words = words.concat(word)
          res.json(word)
        })
    })
  
})

app.delete('/api/words/:id', (req, res) => {
  const id = Number(req.params.id)

  words = words.filter(i => i.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})