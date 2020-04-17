const express = require('express')
const router = express.Router()

// Public routes

router.get('/', (req, res, next) => res.render('index'))



// Private routes
router.use((req, res, next) => req.session.currentUser ? next() : res.redirect("/login"))

router.get('/perfil', (req, res, next) => res.render('profile', req.session.currentUser))

module.exports = router