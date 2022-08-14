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
    coverImage: {
        type:Buffer,
        required: true
    },
    coverImageType:{
        type:String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'

    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType!=null){
        const ans = `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
        // console.log(`for ${this.title} coverimagpath is ${ans}`)
        return ans
    } else {
        // console.log(`img not found for record ${this.title}`)
        // if(this.coverImageName == null) console.log('fu1')
        // if(this.coverImageType == null) console.log('fu2')
    }
})

module.exports = mongoose.model('Book',bookSchema)

module.exports.coverImageBasePath = coverImageBasePath