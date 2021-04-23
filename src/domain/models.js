const {attributes: a} = require('structure');

const ClientEmail = a({
    value: {
        type: String,
        required: true,
        email: true,
    },
})(class ClientEmail {
    toString() { this.get('value'); }
});

const ItemCategory = a({
    name: {
        type: String,
        required: true,
        alphanumeric: true,
    },
})(class ItemCategory {
    toString() { return this.get('name'); }
});

ItemCategory.coffee = new ItemCategory({name: 'coffee'});
ItemCategory.tea = new ItemCategory({name: 'tea'});
ItemCategory.sandwich = new ItemCategory({name: 'sandwich'});

ItemCategory.availableCategories = [
    ItemCategory.coffee,
    ItemCategory.tea,
    ItemCategory.sandwich,
];

ItemCategory.create = function(name) {
    const category = ItemCategory.availableCategories.find(x => x.get('name') === name);
    if (category) {
        return category;
    }

    throw new InvalidItemCategory(name);
};

class InvalidItemCategory extends Error {
    constructor(name) {
        super(`ItemCategory with name ${name} does not exist`);
    }
}

const categories = {
    coffee: new ItemCategory({name: 'coffee'}),
    tea: new ItemCategory({name: 'tea'}),
    sandwich: new ItemCategory({name: 'sandwich'}),
};

const MenuItem = a({
    id: {
        type: String,
        nullable: true,
    },
    name: {
        type: String,
        required: true,
        alphanumeric: true,
    },
    category: {
        type: ItemCategory,
        required: true,
    },
})(class MenuItem {});

const Order = a({
    id: {
        type: String,
        nullable: true,
    },
    clientEmail: {
        type: ClientEmail,
        required: true,
    },
    menuItem: {
        type: MenuItem,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
})(class Order {});

module.exports = {
    Order,
    MenuItem,
    ItemCategory,
    categories,
    ClientEmail,
    InvalidItemCategory,
};
