const db = require('../storage/database');

const creditsByCategory = {
    coffee: 1,
    tea: 0.5,
    sandwich: 3,
};

class MenuItemUnknown extends Error {
    constructor() {
        super('Unable to calculate credits for this menu item');
    }
}

async function getCreditsByEmail(email) {
    const orders = await db.getOrdersByClientEmail(email);
    let credits = 0;
    for (const order of orders) {
        const {category: menuItemCategory} = await db.getMenuItemById(order.item_id);
        const creditPoints = creditsByCategory[menuItemCategory];
        if (creditPoints === undefined) {
            throw new MenuItemUnknown();
        }

        credits += creditPoints * order.quantity;
    }

    return credits;
}

module.exports = {
    creditsByCategory,
    getCreditsByEmail,
    errors: {
        MenuItemUnknown,
    },
};
