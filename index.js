const bodyParser = require('body-parser');
const express = require('express');
const connection = require('./database/database')
const session = require('express-session')


const categoriesController = require('./categories/CategoriesController');;
const articlesController = require('./articles/ArticlesController');
const usersController = require('./user/UserController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./user/User');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');

app.use(session({
    secret: 'mamaco',
    cookie: {
        maxAge: 7200000
    }
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connection.authenticate()
    .then(() => {
        console.log('Conexão efetuada com sucesso')
    })
    .catch((error) => {
        console.log(error)
    })

app.get('/', (req, res) => {

    Article.findAll({
        order: [
            ['id', 'desc']
        ],
        limit: 4
    })
        .then(articles => {
            Category.findAll().then(categories => {
                res.render('index', { articles, categories });
            })
        })
});

app.get('/:slug', (req, res) => {


    let slug = req.params.slug
    // if (slug == 'login') {
    //     res.redirect('/login')
    // }
    Article.findOne({
        where: {
            slug
        }
    })
        .then(article => {
            let validation = article != undefined && article != '' && article != null;
            if (validation) {
                Category.findAll().then(categories => {
                    res.render('article', { article, categories });
                })
            } else {
                res.redirect('/');
            }
        })
        .catch(error => {
            res.redirect('/');
        })
});

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug

    Category.findOne({
        where: {
            slug
        },
        include: [{ model: Article }]
    })
        .then(category => {
            let validation = category != undefined && category != '' && category != null;
            if (validation) {

                Category.findAll().then(categories => {
                    res.render('index', { articles: category.articles, categories });
                })

            } else {
                res.redirect('/');
            }
        })
        .catch(error => {
            res.redirect('/');
        })
});



app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);


app.listen(port, () => {
    console.log(`🚀 Servidor iniciado com sucesso na porta ${port}`);
});