const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('../models/user.model')

// Registro
router.get('/signup', (req, res, next) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        res.render('auth/signup', { errorMessage: '<p>Rellena todos los campos, ¡hombre ya!</p>' })
        return
    }

    if (password.length < 3) {
        res.render('auth/signup', { errorMessage: '<p>La contraseña debe tener mínimo 4 caracteres</p>' })
        return
    }

    User.findOne({ email })
        .then(theFoundUser => {
            if (theFoundUser) {
                res.render('auth/signup', { errorMessage: '<p>El email ya existe</p>' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ email, password: hashPass })
                .then(theNewUserRegistered => res.redirect('/'))
                .catch(err => console.log("Hubo un error!", err))

        })
        .catch(err => console.log("Hubo un error!", err))
})


// Login
router.get('/login', (req, res, next) => res.render('auth/login'))
router.post('/login', (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        res.render("auth/login", { errorMessage: "<p>Rellena todos los campos</p>" })
        return
    }

    User.findOne({ email })
        .then(theFoundUser => {

            if (!theFoundUser) {
                res.render("auth/login", { errorMessage: "<p>El email no se encunetra en la BBDD</p>" })
                return
            }

            if (!bcrypt.compareSync(password, theFoundUser.password)) {
                res.render("auth/login", { errorMessage: "<p>La contraseña no coincide</p>" })
                return
            }

            req.session.currentUser = theFoundUser
            res.redirect("/")
        })
        .catch(err => console.log("Hubo un error!", err))

})



// Cerrar sesión
router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect("/"))
})

module.exports = router