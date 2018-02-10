const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(cors())

morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :content :response-time ms'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    },
    {
        name: "Sami Saukkonen",
        number: "040-123456",
        id: 5
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    res.json(person)
})

app.get('/info', (req, res) => {
    const currentPersons = persons.length
    res.send(`<p>puhelinluettelossa ${currentPersons} henkilön tiedot</p>
              <p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (name === undefined || number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    } else if (persons.filter(person => person.name.toLowerCase() === name.toLowerCase()).length > 0) {
        return res.status(400).json({ error: 'name is already in list' })
    } else if (persons.filter(person => person.number === number).length > 0) {
        return res.status(400).json({ error: 'number is already in list' })
    }

    const person = {
        name: name,
        number: number,
        id: Math.floor(Math.random() * 100000)
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})