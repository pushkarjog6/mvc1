const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    }
})

authorSchema.pre('remove',function(next){
    Book.find({author: this.id}, (error,books)=>{
        if(error){
            console.log('error1: '+error)
            next(error)
        }
        else if(books.length>0){
            console.log('has a book')
            next(new Error('This author still has books'))
        }
        else next()
    })
})

module.exports = mongoose.model('Author',authorSchema)