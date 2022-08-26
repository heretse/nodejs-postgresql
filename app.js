const express = require('express');
const { Client, Pool } = require('pg');

console.log('POOL_SIZE_MAX =', process.env.POOL_SIZE_MAX)

const pool = new Pool({
    host: 'postgres', //'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'northwind',
    max: (process.env.POOL_SIZE_MAX) ? process.env.POOL_SIZE_MAX : 50,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 3000,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err) // your callback here
    process.exit(-1)
})


var app = express()

app.set('port', process.env.PORT || 3000)

app.get('/:id', async function (req, res, next) {
    const id = req.params.id

    pool.connect((err, client, release) => {
        if (err) {
            res.status(400).send(err)
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * FROM Products where product_id = $1', [id], (err, result) => {
            client.release()
            if (err) {
                res.status(400).send(err)
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.status(200).send(result.rows)
        })
    })
})

app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
})