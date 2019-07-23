require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Note = require('./models/note')

const app = express()

app.use(bodyParser.json()) //should be the very first middleware loaded into the Express
app.use(morgan('combined'))
app.use(cors())
app.use(express.static('build'))


const errorHandler = (error,request,response,next) => {
    console.error(error.message)
    if(error.name == "CastError" && error.kind == "ObjectId") {
        return response.status(400).send({error:'Ill Formatted id'})
    } else if (error.name === "ValidationError") {
        return response.status(400).send({error:error.message})
    }
    next(error)
}
app.use(errorHandler)

let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "date": "2019-05-30T17:30:31.098Z",
        "important": true
      },
      {
        "id": 2,
        "content": "Browser can execute only Javascript",
        "date": "2019-05-30T18:39:34.091Z",
        "important": false
      },
      {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "date": "2019-05-30T19:20:14.298Z",
        "important": true
      },
]

app.get('/',(req,res) => {
    res.send("<h1> Hello, World! Haha Nodemon! DigiMon! </h1>")
})

app.get("/notes",(req,res) => {
    Note.find({}).then(notes => {
        res.json(notes.map(note => note.toJSON()))
    })
})

app.get("/notes/:id",(request,response,next) => {
    Note.findById(request.params.id)
    .then(note => {
        if(note) {
            response.json(note.toJSON())
        } else {
            response.status(204).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/notes/:id',(request,response,next) => {
    Note.findByIdAndRemove(request.params.id)
    .then(reuslt=> {
    	response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/notes",(request,response,next) => {

    const body = request.body

    if(body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
        response.json(savedAndFormattedNote)
    })
    .catch(error => next(error))
})

app.put('/notes/:id',(request,response,next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id,note,{new:true})
    .then(updatedNote => {
        response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})