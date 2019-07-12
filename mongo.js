const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log("please provide password as an argument")
    process.exit(1)
} 

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0-yqxu2.mongodb.net/notes-app?retryWrites=true&w=majority`

mongoose.connect(url,{ useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
    content: String,
    data: Date,
    important: Boolean
})

const Note = mongoose.model('Note',noteSchema)

// const note = new Note({
//     content: 'Browser can execute only Javascript',
//     date: new Date(),
//     important: false,
// })

// note.save().then(response => {
//     console.log("note saved!")
//     mongoose.connection.close()
// })

Note.find({important:true}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})