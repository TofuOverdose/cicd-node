/* global describe, test, expect, fail */

const faker = require('faker');
const {MenuItem} = require('../../../domain/models');
const ModelValidationError = require('../../errors/ModelValidationError');

const repo = require('../../../infra/database/memory');
const createMenuItem = require('../CreateMenuItem')(repo);

describe('Testing CreateMenuItem use case', () => {
    describe('Passing category field', () => {
        test('Passing invalid category should throw Model Validation Error', async() => {
            const validMenuItemName = faker.lorem.word();
            const invalidCategory = faker.lorem.word();
            try {
                await createMenuItem({
                    name: validMenuItemName,
                    category: invalidCategory,
                });
                fail('No error was thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(ModelValidationError);
                expect(e.errors).toHaveProperty('category');
            }
        });

        test.each(['coffee', 'tea', 'sandwich'])('Creating with category %s', async(categoryName) => {
            const validMenuItemName = faker.lorem.word();
            const menuItem = await createMenuItem({name: validMenuItemName, category: categoryName});
            expect(menuItem).toBeInstanceOf(MenuItem);
            expect(menuItem.get('name')).toBe(validMenuItemName);
            expect(menuItem.get('category').get('name')).toBe(categoryName);
        });
    });
});
