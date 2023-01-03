const express = require('express')
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
});

router.get('/admin/categories/edit/:id', (req, res) => {
    let id = req.params.id;
    let validation = id != undefined && id != '' && id != null && !isNaN(id);
    Category.findByPk(id).then((category) => {
        if (validation) {
            res.render('admin/categories/edit', { category })
        } else {
            res.redirect('/admin/categories')
        }
    }).catch(erro => {
        res.redirect('/admin/categories')
    })
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', { categories });
    });
});

router.post('/categories/save', (req, res) => {
    let title = req.body.title;

    let validation = title != undefined && title != '' && title != null;

    if (validation) {
        Category.create({
            title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories/new');
    }

});

router.post('/categories/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    let validation = title != undefined && title != '' && title != null && id != undefined && id != '' && id != null;

    if (validation) {
        Category.update({
            title,
            slug: slugify(title)
        }, {
            where: {
                id
            }
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories/new');
    }

});

router.post('/categories/delete', (req, res) => {
    let id = req.body.id;
    let validation = id != undefined && id != '' && id != null;
    if (validation) {
        Category.destroy({
            where: {
                id
            }
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories');
    }
})

module.exports = router;