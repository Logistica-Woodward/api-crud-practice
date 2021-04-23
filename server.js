// Dependencies
const express = require("express");
const compression   = require('compression')
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

// Server
const app = express();
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.disable('x-powered-by')
app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log("El servidor está inicializado en el puerto 4000");
});

const dbServer = new Sequelize('tododevelopment', 'tododevelopment', 'Mw3O76KX_gB-', {
    host: 'den1.mysql4.gear.host',
    dialect: 'mysql'
});

// Routes
app.get('/status', function (req, res) {
    dbServer
        .authenticate()
        .then(() => {
            res.send({
                message: 'Connection stablished successfully',
                code: 200,
            });
        })
        .catch(err => {
            res.send({
                message: 'Connection failed',
                status: err,
                code: 400,
            });
        });
});

app.get('/read/todos', (req, res) => {

    const getTodos = `SELECT * FROM todos`

    dbServer.query(getTodos, { type: dbServer.QueryTypes.SELECT })
    .then((result) => {
        res.send({
            result,
            status: 200,
        })
    })
    .catch((err) => {
        res.send({
            result: err,
            status: 301,
        })
    })
});

app.post('/create/todos', (req, res) => {
    const {
      title,
      status,
    } = req.body;

    const createTodos = `INSERT INTO todos(title, status) VALUES('${title}', ${status})`

    dbServer.query(createTodos, { type: dbServer.QueryTypes.INSERT })
    .then((result) => {
        res.send({
            result,
            status: 200,
        })
    })
    .catch((err) => {
        res.send({
            result: err,
            status: 301,
        })
    })
});

app.post('/update/todos', (req, res) => {
    const {
      title,
      id
    } = req.body;

    const updateTodos = 
    `
        UPDATE todos
        SET title = '${title}'
        WHERE id = ${id}
    `

    dbServer.query(updateTodos, { type: dbServer.QueryTypes.UPDATE })
    .then((result) => {
        res.send({
            result,
            status: 200,
        })
    })
    .catch((err) => {
        res.send({
            result: err,
            status: 301,
        })
    })
});

app.get('/delete/todos/:id', (req, res) => {
    const {
      id
    } = req.params;

    const deleteTodos = `DELETE FROM todos WHERE id = ${id}`

    dbServer.query(deleteTodos, { type: dbServer.QueryTypes.DELETE})
    .then((result) => {
        res.send({
            result,
            status: 200,
        })
    })
    .catch((err) => {
        res.send({
            result: err,
            status: 301,
        })
    })
});

app.post('/update/todos/status', (req, res) => {
    const {
      status,
      id
    } = req.body;

    const statusTodos = 
    `
        UPDATE todos
        SET status = ${status}
        WHERE id = ${id}
    `

    dbServer.query(statusTodos, { type: dbServer.QueryTypes.UPDATE })
    .then((result) => {
        res.send({
            result,
            status: 200,
        })
    })
    .catch((err) => {
        res.send({
            result: err,
            status: 301,
        })
    })
});