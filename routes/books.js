const express = require('express')
const router = express.Router()

const Book = require('../models/book')
const Author = require('../models/author')

const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public',Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req,file,callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

const fs = require('fs')


router.get('/', async(req,res)=>{
    let query = Book.find()
    // console.log(query)
    
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
        console.log(query)
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    try {
          const books = await query.exec()
          res.render('books/index',{
              books: books,
              searchOptions: req.query
          })
    } catch {

    }
})

router.get('/new', async(req,res)=>{
    renderNewPage(res,new Book())
    

})

router.post('/', upload.single('coverImageName'),async(req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title:req.body.title,
        author: req.body.author.trim(),
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    // if(mongoose.Types.ObjectId.isValid(req.body.author)) console.log('valid hai bsdk')
    // else console.log('js hi chutiya hai bhenchod')
    // console.log(typeof(req.body.author))
    // console.log(req.body.author.length)

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch (error) {
        // console.log('hola error')
        console.log(error)
        if(book.coverImageName!=null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res,book,true, error)
    }

    // res.redirect('/books')
})

module.exports = router



async function renderNewPage(res, book, hasError=false,error) {
    try {
        const authors = await Author.find({})
        const params = {
            authors:authors,
            book: book
        }
        if(hasError) params.errorMessage = error.message
        res.render('books/new',params)
    } catch (error) {
        console.log(error)
        res.redirect('/books')

    }
}

function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath,filename),(err)=> {
        console.error(err)
    })
}