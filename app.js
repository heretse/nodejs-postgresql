const express = require('express');
const { Client, Pool } = require('pg');
// const connectionString = 'postgres://postgres:postgres@localhost:5432/northwind';
// const client = new Client({
//     connectionString: connectionString
// })

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'northwind',
    max: 50,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 3000,
});

// client.connect()

var app = express()

app.set('port', process.env.PORT || 3000)

app.get('/:id', async function (req, res, next) {
    const id = req.params.id

    client = await pool.connect()
    client.query('SELECT * FROM Products where product_id = $1', [id], function (err, result) {
        client.release()
        if (err) {
            console.error('Error executing query', err.stack)
            res.status(400).send(err)
        }
        console.log(result.rows)
        res.status(200).send(result.rows)
    })
})

app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
})