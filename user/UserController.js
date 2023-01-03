const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll({}).then(users => {
        res.render('admin/users/index', { users })
    })

})


router.get('/admin/users/create', adminAuth, (req, res) => {
    res.render('admin/users/create')
})

router.post('/user/create', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {
            email
        }
    }).then(user => {
        if (user == undefined || user == null) {
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            User.create({
                email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch((err) => {
                res.redirect('/')
            });
        } else {
            // res.redirect('/admin/users/create')
            res.render('admin/users/create', { erro: 'Email já foi cadastrado' })
        }
    })
})

router.get('/admin/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {
            email
        }
    })
        .then(user => {
            if (user != undefined || user != null) {
                let correct = bcrypt.compareSync(password, user.password)
                if (correct) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }
                    res.redirect('/admin/articles')
                } else {
                    res.render('admin/users/login', { erro: 'Email ou senha incorreto' })   
                }
            } else {
                res.render('admin/users/login', { erro: 'Usuário inexistente' })
            }
        })
})

router.get('/admin/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/')
})

module.exports = router;