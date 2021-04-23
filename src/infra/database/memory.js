const {Order, MenuItem} = require('../../domain/models');

const _menu = {
    idx: 0,
    data: [],
};

const _orders = {
    idx: 0,
    data: [],
};

async function createOrder(orderInstance) {
    const o = orderInstance.toJSON();
    o.id = _orders.idx++;
    _orders.data.push(o);
    return o.id;
}

async function getOrderById(orderId) {
    const o = _orders.data.find(x => x.id === orderId);
    return o === undefined ? undefined : new Order(o);
}

async function getOrdersByClientEmail(clientEmail) {
    const o = _orders.data.find(x => x.clientEmail === clientEmail);
    return o === undefined ? undefined : new Order(o);
}

async function createMenuItem(menuItem) {
    const m = menuItem.toJSON();
    m.id = _menu.idx++;
    _menu.data.push(m);
    return m.id;
}

async function getMenuItemByName(menuItemName) {
    const m = _menu.data.find(x => x.name === menuItemName);
    return m === undefined ? undefined : new MenuItem(m);
}

async function getMenuItemById(menuItemId) {
    const m = _menu.data.find(x => x.id === menuItemId);
    return m === undefined ? undefined : new MenuItem(m);
}

async function getMenuItems() {
    return _menu.data.map(x => new MenuItem(x));
}

async function menuItemExists(menuItem) {
    const {id} = menuItem.toJSON();
    return _menu.data.findIndex(x => x.id === id) > -1;
}

async function orderExists(order) {
    const {id} = order.toJSON();
    return _orders.data.findIndex(x => x.id === id) > -1;
}

module.exports = {
    createMenuItem,
    menuItemExists,
    getMenuItems,
    getMenuItemById,
    getMenuItemByName,
    createOrder,
    orderExists,
    getOrderById,
    getOrdersByClientEmail,
};
