const mysql = require('mysql2');
const config = require('../../../config');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config('db.host'),
    port: config('db.port'),
    database: config('db.name'),
    user: config('db.user'),
    password: config('db.pass'),
});

function createOrder({clientEmail, itemId, quantity}) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO orders(client_email, item_id, quantity) VALUES (?, ?, ?);';
        const inserts = [clientEmail, itemId, quantity];
        pool.query(mysql.format(sql, inserts), (err, results, _) => {
            if (err) {
                return reject(err);
            }

            getOrderById(results.insertId)
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    });
}

function getOrderById(orderId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orders WHERE id=?;';
        pool.query(mysql.format(sql, [orderId]), (err, results, _) => err ? reject(err) : resolve(results[0]));
    });
}

function getOrdersByClientEmail(clientEmail) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orders WHERE client_email=?;';
        pool.query(mysql.format(sql, [clientEmail]), (err, results, _) => err ? reject(err) : resolve(results));
    });
}

function getMenuItems() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM menu;';
        pool.query(sql, (err, results, _) => err ? reject(err) : resolve(results));
    });
}

function getMenuItemByName(itemName) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM menu WHERE name=?;';
        pool.query(mysql.format(sql, [itemName]), (err, results, _) => err ? reject(err) : resolve(results[0]));
    });
}

function getMenuItemById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM menu WHERE id=?;';
        pool.query(mysql.format(sql, [id]), (err, results, _) => err ? reject(err) : resolve(results[0]));
    });
}

module.exports = {
    createOrder,
    getOrderById,
    getOrdersByClientEmail,
    getMenuItems,
    getMenuItemByName,
    getMenuItemById,
};
