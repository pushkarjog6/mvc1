const express = require('express')
const router = express.Router()

const Author = require('../models/author')
const Book = require('../models/book')

// default
router.get('/',async (req,res)=> {
    let searchOptions = {}
    if(req.query.name != null && req.query.name != ''){
        searchOptions.name = new RegExp(req.query.name,'i');
        // searchOptions.name = req.query.name
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors:authors,
            searchOptions:req.query
        })

    } catch (error) {
        res.redirect('/')
    }
})

// new author

router.get('/new',(req,res)=> {
    res.render('authors/new', {author: new Author()})
})

// create route
router.post('/', async (req,res)=> {
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
        // res.redirect('authors')
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
        console.log(error)
    }
})

router.get('/new', async(req,res)=>{
    renderNewPage(res,new Book())
    

})

router.get('/:id', async (req,res)=>{
    let author
    try {
        author = await Author.findById(req.params.id)
        booksByAuthor = await Book.find({author:author.id}).limit(6).exec()
        res.render('authors/show',{
            author:author,
            booksByAuthor:booksByAuthor
        })
    } catch (error) {
        console.log(error)
        res.redirect('/authors')
    }
})

router.get('/:id/edit', async (req,res)=>{
    try {
        const author = await Author.findById(req.params.id)
        // console.log(author)
        res.render('authors/edit',{author: author})
        console.log('hola')
    } catch (error) {
        console.log('hola-error')
        res.redirect('/authors')
    }
})

router.put('/:id',async (req,res)=>{
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
        // res.redirect('authors')
    } catch (error) {
        console.log(error)
        if(author == null){
            res.redirect('/')
        }

        res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating author'
        })
    }

})

router.delete('/:id',async (req,res)=>{
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (error) {
        console.log('error :'+error)
        if(author==null) res.redirect('/')
        else res.redirect(`/authors/${author.id}`)
    }

})

module.exports = router