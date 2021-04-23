/* global describe, test, expect, fail */

const faker = require('faker');
const {MenuItem, ItemCategory} = require('../../../domain/models');

const repo = require('../../../infra/database/memory');

const getMenu = require('../GetMenu')(repo);
const EmptyMenuError = require('../../errors/EmptyMenuError');

describe('Testing GetMenu use case', () => {
    test('When the menu is empty an error should be thrown', async() => {
        try {
            await getMenu();
            fail('No error was thrown');
        } catch (e) {
            expect(e).toBeInstanceOf(EmptyMenuError);
        }
    });

    test('When menu is populated the entire list should be returned correctly', async() => {
        const categories = faker.lorem.words(faker.random.number({min: 1})).split(' ');
        const menuItemsCount = faker.random.number({min: 3, max: 1000});
        const menuItemsIds = [];
        for (let i = 0; i < menuItemsCount; i++) {
            const menuItemId = await repo.createMenuItem(new MenuItem({
                name: faker.lorem.word(),
                category: new ItemCategory({
                    name: faker.random.arrayElement(categories),
                }),
            }));
            const menuItem = await repo.getMenuItemById(menuItemId);
            menuItemsIds.push(menuItem.get('id'));
        }

        // The test starts here;
        const results = await getMenu();
        expect(results).toHaveLength(menuItemsIds.length);
        for (const res of results) {
            expect(res).toBeInstanceOf(MenuItem);
            expect(menuItemsIds).toContain(res.get('id'));
        }
    });
});
