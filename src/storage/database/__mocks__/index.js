const _menu = {
    idx: 0,
    d: [],
};

const _orders = {
    idx: 0,
    d: [],
};

async function createMenuItem({name, category}) {
    const item = {
        id: _menu.idx++,
        name: name,
        category: category,
    };
    _menu.d.push({...item});
    return item;
}

async function createOrder({clientEmail, itemId, quantity}) {
    const order = {
        id: _orders.idx++,
        client_email: clientEmail,
        item_id: itemId,
        quantity: quantity,
    };
    _orders.d.push({...order});
    return order;
}

async function getOrderById(orderId) {
    const order = _orders.d.find(x => x.id === orderId);
    return order ? {...order} : undefined;
}

async function getOrdersByClientEmail(clientEmail) {
    const orders = _orders.d.filter(x => x.client_email === clientEmail);
    return orders.map(x => ({...x}));
}

async function getMenuItems() {
    return _menu.d.map(x => ({...x}));
}

async function getMenuItemByName(itemName) {
    const item = _menu.d.find(x => x.name === itemName);
    return item ? {...item} : undefined;
}

async function getMenuItemById(id) {
    const item = _menu.d.find(x => x.id === id);
    return item ? {...item} : undefined;
}

module.exports = {
    createOrder,
    createMenuItem,
    getOrderById,
    getOrdersByClientEmail,
    getMenuItems,
    getMenuItemByName,
    getMenuItemById,
};
