/* global jest, describe, beforeEach, test, expect */

const db = require('../storage/database');
const coffee = require('./coffee');
const faker = require('faker');
jest.mock('../storage/database');

function fakeOrders(menuItemsIds, clientsEmails) {
    const orders = [];
    for (let i = 0; i < faker.random.number({min: 10, max: 100}); i++) {
        orders.push({
            clientEmail: faker.random.arrayElement(clientsEmails),
            itemId: faker.random.arrayElement(menuItemsIds),
            quantity: faker.random.number({min: 1}),
        });
    }
    return orders;
}

describe('Testing getCreditsByEmail(email)', () => {
    beforeEach(() => {
        // The mocked module has local state - need to reset it for each test
        jest.resetModules();
    });

    describe('Edge cases', () => {
        test('Should return 0 when client email does not exist', async() => {
            const credits = await coffee.getCreditsByEmail('fksofseopfksefop');
            expect(credits).toBe(0);
        });
    });

    const menuSeeds = [
        {name: 'aaa', category: 'coffee'},
        {name: 'bbb', category: 'tea'},
        {name: 'ccc', category: 'sandwich'},
        {name: 'ddd', category: 'coffee'},
    ];

    describe('Testing with random values', () => {
        menuSeeds.forEach(x => db.createMenuItem(x));
        const emails = [];
        for (let i = 0; i < faker.random.number({min: 3, max: 10}); i++) {
            emails.push(faker.internet.email());
        }
        const ordersSeeds = fakeOrders([0, 1, 2, 3], emails);
        const testSets = emails.map(email => {
            const credits = ordersSeeds.reduce((acc, order) => {
                if (order.clientEmail === email) {
                    acc += coffee.creditsByCategory[menuSeeds[order.itemId].category] * order.quantity;
                }
                return acc;
            }, 0);
            return [email, credits];
        });
        ordersSeeds.forEach(x => db.createOrder(x));

        test.each(testSets)('For %s should return %d', async(email, expected) => {
            const result = await coffee.getCreditsByEmail(email);
            expect(result).toBe(expected);
        });
    });
});
