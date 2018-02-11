const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :content :response-time ms'))

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
              <p>${new Date()}</p>`)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person
        .findOneAndUpdate({_id: req.params.id}, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (name === undefined || number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    } else if (name === '') {
        console.log('name is missing!')
        return res.status(400).json({ error: 'name is missing!' })
    } else if (number === '') {
        console.log('number is missing!')
        return res.status(400).json({ error: 'number is missing!' })
    }

    const person = new Person({
        name: name,
        number: number
    })

    person
        .save()
        .then(result => {
            res.json(Person.format(result))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})