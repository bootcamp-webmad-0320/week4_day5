const express = require('express')
const router = express.Router()

const Book = require('../models/book-model')
const Author = require('../models/author-model')

// Read documents(list)
router.get('/lista', (req, res, next) => {

    Book.find()
        .populate('author')
        .then(allBooks => res.render('books/books-list', { allBooks }))
        .catch(err => console.log("Ha habido un error!", err))
})


// Read documents (details)
router.get('/detalles/:bookId', (req, res, next) => {

    if (/^[0-9a-fA-F]{24}$/.test(req.params.bookId) === false) {
        return res.status(404).render('not-found');
    }

    Book.findById(req.params.bookId)
        .populate('author')
        .then(theBook => res.render('books/book-detail', theBook))
        .catch(err => console.log("Ha habido un error!", err))
})


// Create documents
router.get('/crear', (req, res, next) => res.render('books/book-create'))
router.post('/crear', (req, res, next) => {

    const { title, description, author, rating } = req.body

    Book.create({ title, description, author, rating })
        .then(() => res.redirect('/libros/lista'))
        .catch(err => console.log("Hubo un error", err))
})


// Edit documents
router.get('/editar', (req, res, next) => {

    Book.findById(req.query.bookId)
        .then(theBookToEdit => res.render('books/book-edit', theBookToEdit))
        .catch(err => console.log("Hubo un error", err))
})

router.post('/editar', (req, res, next) => {

    const { title, description, author, rating } = req.body

    Book.findByIdAndUpdate(req.query.bookId, { title, description, author, rating }, { new: true })
        .then(theUpdatedBook => res.redirect(`/libros/detalles/${theUpdatedBook._id}`))
        .catch(err => console.log("Hubo un error", err))
})


module.exports = router