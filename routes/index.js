const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/',async(req,res)=> {
    try {
        // throw 0
        let books = await Book.find().sort({createAt:'desc'}).limit(5).exec()
        res.render('index', {
            books: books
        })
        
    } catch (error) {
        // let books=[]
        res.render('index',{
            books: []
        })
        console.log('error fetching 5 recent books')
    }
})

module.exports = router