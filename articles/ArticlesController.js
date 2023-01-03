const express = require('express');
const Category = require('../categories/Category');
const router = express.Router();
const Article = require('./Article');
const slugify = require('slugify');



router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render('admin/articles/index', { articles })
    })

});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories })
    })

});

router.post('/articles/save', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let categoryId = req.body.category

    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId
    }).then(res.redirect('/admin/articles'))

})


router.get('/admin/articles/edit/:id', (req, res) => {

    let id = req.params.id;
    
    let validation = id != undefined && id != '' && id != null && !isNaN(id);
    Article.findByPk(id).then((article) => {
        if (validation) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article, categories })
            })
        } else {
            res.redirect('/admin/articles')
        }
    }).catch(erro => {
        res.redirect('/admin/articles')
    })
});

router.post('/articles/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title
    let body = req.body.body
    let categoryId = req.body.category

    let validation = title != undefined && title != '' && title != null && id != undefined && id != '' && id != null;

    if (validation) {
        Article.update({
            title,
            slug: slugify(title),
            body,
            categoryId
        }, {
            where: {
                id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        })
    } else {
        res.redirect('/admin/articles/new');
    }

});

router.post('/articles/delete', (req, res) => {
    let id = req.body.id;
    let validation = id != undefined && id != '' && id != null;
    if (validation) {
        Article.destroy({
            where: {
                id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        })
    } else {
        res.redirect('/admin/articles');
    }
})

module.exports = router;