const bodyParser = require('body-parser');
const express = require('express');
const connection = require('./database/database')


const categoriesController = require('./categories/CategoriesController');;
const articlesController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
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
    res.render('index');
});

app.use('/', categoriesController);
app.use('/', articlesController);

app.listen(port, () => {
    console.log(`🚀 Servidor iniciado com sucesso na porta ${port}`);
});