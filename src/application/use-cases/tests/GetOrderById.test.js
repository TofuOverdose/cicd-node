/* global describe, test, expect */

const faker = require('faker');

const repo = require('../../../infra/database/memory');
const {MenuItem, Order, ItemCategory, ClientEmail} = require('../../../domain/models');

const getOrderById = require('../GetOrderById')(repo);

describe('Testing Get Order use case', () => {
    test('Fetching existing Order should return its instance', async() => {
        const menuItemId = await repo.createMenuItem(new MenuItem({
            name: 'item1',
            category: ItemCategory.coffee,
        }));
        const menuItem = await repo.getMenuItemById(menuItemId);
        const orderId = await repo.createOrder(new Order({
            clientEmail: new ClientEmail({value: faker.internet.email()}),
            menuItem: menuItem,
            quantity: faker.random.number({min: 1, max: 10}),
        }));
        const order = await repo.getOrderById(orderId);
        const result = await getOrderById(orderId);
        expect(result).toEqual(order);
    });

    test('Fetching non-existing Order should throw error', async() => {
        const orderId = faker.random.number();
        await expect(getOrderById(orderId)).rejects.toThrow();
    });
});
