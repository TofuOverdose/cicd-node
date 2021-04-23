/* global jest, describe, beforeEach, afterEach, test, expect, fail */

const faker = require('faker');

const repo = require('../../../infra/database/memory');
const useCreateOrder = require('../CreateOrder');
const createOrder = useCreateOrder(repo);

const {Order, MenuItem, ItemCategory} = require('../../../domain/models');
const ModelValidationError = require('../../errors/ModelValidationError');

describe('Testing CreateOrder use case', () => {
    const validMenuItemId = faker.random.arrayElement([0, 1, 2]);
    const validQuantity = faker.random.number({min: 1, max: 10});
    const validEmails = ['email@mail.ru', 'some.mail@example.com', 'test@test.mail.com', 'some.box@test.mail.com', 'test123@example.net'];

    beforeEach(async() => {
        await repo.createMenuItem(new MenuItem({
            name: 'product0',
            category: new ItemCategory({name: 'category0'}),
        }));
        await repo.createMenuItem(new MenuItem({
            name: 'product1',
            category: new ItemCategory({name: 'category1'}),
        }));
        await repo.createMenuItem(new MenuItem({
            name: 'product2',
            category: new ItemCategory({name: 'category1'}),
        }));
    });

    describe('Testing client email field', () => {
        describe('Passing invalid email should throw validation error', () => {
            const invalidEmails = [123, true, '', {}, 'foobar', 'foo bar', 'foobar@', 'foobar@test', 'foobar@test@'];
            test.each(invalidEmails)('Passing %s', async(invalidEmail) => {
                try {
                    await createOrder(invalidEmail, validMenuItemId, validQuantity);
                    fail("Validation error wasn't thrown");
                } catch (e) {
                    expect(e).toBeInstanceOf(ModelValidationError);
                    expect(e.errors).toHaveProperty('clientEmail');
                }
            });
        });

        describe('Passing valid email should throw no error', () => {
            test.each(validEmails)('With %s', async(validEmail) => {
                await expect(createOrder(validEmail, validMenuItemId, validQuantity)).resolves.toBeInstanceOf(Order);
            });
        });
    });

    describe('Testing menu item field', () => {
        describe('Passing exiting menu item should throw no error', () => {
            const validEmail = faker.random.arrayElement(validEmails);
            test.each([0, 1, 2])('With %s', async(validItemId) => {
                await expect(createOrder(validEmail, validItemId, validQuantity)).resolves.toBeInstanceOf(Order);
            });
        });

        describe('Passing non-existing menu item should throw error', () => {
            const validEmail = faker.random.arrayElement(validEmails);
            test.each([-1, 99999, 'abc', ''])('With %s', async(validItemId) => {
                await expect(createOrder(validEmail, validItemId, validQuantity)).rejects.toThrow();
            });
        });
    });

    describe('Testing quantity field', () => {
        describe('Passing correct value should throw no error', () => {
            test.each([1, 2, 3, 4, 10, 100, 1000])('With %d', async(validQuantity) => {
                const validEmail = faker.random.arrayElement(validEmails);
                await expect(createOrder(validEmail, validMenuItemId, validQuantity)).resolves.toBeInstanceOf(Order);
            });
        });

        describe('Passing incorrect type should throw validation error', () => {
            test.each([-1, 0, -2, -3, -100, 123.1234])('With %d', async(invalidQuantity) => {
                const validEmail = faker.random.arrayElement(validEmails);
                try {
                    await createOrder(validEmail, validMenuItemId, invalidQuantity);
                    fail('No error was thrown');
                } catch (e) {
                    expect(e).toBeInstanceOf(ModelValidationError);
                    expect(e.errors).toHaveProperty('quantity');
                }
            });
        });
    });

    afterEach(() => {
        jest.resetModules();
    });
});
