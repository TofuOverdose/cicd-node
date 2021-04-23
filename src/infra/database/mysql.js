const mysql = require('mysql2');
const config = require('../config');
const {Order, MenuItem, ClientEmail, ItemCategory} = require('../../domain/models');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config('db.host'),
    port: config('db.port'),
    database: config('db.name'),
    user: config('db.user'),
    password: config('db.pass'),
});

function _execute(statement) {
    return new Promise((resolve, reject) =>
        pool.query(statement, (err, res, _) => err ? reject(err) : resolve(res)));
}

async function createOrder(orderInstance) {
    const order = orderInstance.toJSON();
    console.log(order);
    const sql = 'INSERT INTO orders(client_email, item_id, quantity) VALUES (?, ?, ?);';
    const statement = mysql.format(sql, [order.clientEmail.value, order.menuItem.id, order.quantity]);
    await _execute(statement);
}

async function getOrderById(orderId) {
    const sql = 'SELECT * FROM (SELECT * FROM orders WHERE id = ?) as orders JOIN menu ON orders.item_id = menu.id;';
    const statement = mysql.format(sql, [orderId]);
    const result = (await _execute(statement))[0];
    if (result === undefined) {
        return undefined;
    }

    return new Order({
        id: result.id,
        clientEmail: new ClientEmail({value: result.client_email}),
        menuItem: new MenuItem({
            id: result.item_id,
            name: result.name,
            category: new ItemCategory(result.category),
        }),
        quantity: result.quantity,
    });
}

async function getOrdersByClientEmail(clientEmail) {
    const sql = 'SELECT * FROM (orders AS o JOIN menu AS m ON o.item_id = m.id) WHERE o.client_email = "doejohn@example.com";';
    const statement = mysql.format(sql, [clientEmail]);
    const results = await _execute(statement);
    return results.map(res => new Order({
        id: res.id,
        clientEmail: new ClientEmail({value: res.client_email}),
        menuItem: new MenuItem({name: res.name}),
        quantity: res.quantity,
    }));
}

async function createMenuItem(menuItem) {
    const data = menuItem.toJSON();
    const sql = 'INSERT INTO menu(name, category) VALUES(?, ?);';
    const statement = mysql.format(sql, [data.name, data.category]);
    const {insertId} = await _execute(statement);
    return insertId;
}

async function getMenuItemByName(menuItemName) {
    const sql = 'SELECT * FROM menu WHERE name=?;';
    const statement = mysql.format(sql, [menuItemName]);
    const result = (await _execute(statement))[0];
    if (result === undefined) {
        return undefined;
    }

    const menuItem = new MenuItem({
        id: result.id,
        name: result.name,
        category: new ItemCategory(result.category),
    });
    return menuItem;
}

async function getMenuItemById(menuItemId) {
    const sql = 'SELECT * FROM menu WHERE id=?;';
    const statement = mysql.format(sql, [menuItemId]);
    const result = (await _execute(statement))[0];
    if (result === undefined) {
        return undefined;
    }

    const menuItem = new MenuItem({
        id: result.id,
        name: result.name,
        category: new ItemCategory(result.category),
    });
    return menuItem;
}

async function getMenuItems() {
    const statement = 'SELECT * FROM menu;';
    const results = await _execute(statement);
    return results.map(res => new MenuItem({
        id: res.id,
        name: res.name,
        category: new ItemCategory(res.category),
    }));
}

async function menuItemExists(menuItem) {
    const m = menuItem.toJSON();
    const sql = 'SELECT COUNT(1) AS found FROM menu WHERE id=?;';
    const statement = mysql.format(sql, [m.id]);
    const {found} = (await _execute(statement))[0];
    return !!found;
}

async function orderExists(order) {
    const o = order.toJSON();
    const sql = 'SELECT COUNT(1) AS found FROM orders WHERE id=?;';
    const statement = mysql.format(sql, [o.id]);
    const {found} = (await _execute(statement))[0];
    return !!found;
}

module.exports = {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    getMenuItemByName,
    menuItemExists,
    createOrder,
    getOrderById,
    getOrdersByClientEmail,
    orderExists,
};
