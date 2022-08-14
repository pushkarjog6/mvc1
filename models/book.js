const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/bookCovers'
const path = require('path')

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description: {
        type: String
    },
    publishDate: {
        type:Date,
        required: true
    },
    pageCount: {
        type:Number,
        required: true
    },
    createdAt: {
        type: Number,
        default: Date.now,
        required: true
    },
    coverImageName: {
        type:String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'

    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/',coverImageBasePath,this.coverImageName)
    } else {
        console.log(`img not found for record ${this.title}`)
    }
})

module.exports = mongoose.model('Book',bookSchema)

module.exports.coverImageBasePath = coverImageBasePath