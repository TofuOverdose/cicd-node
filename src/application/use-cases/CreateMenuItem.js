const {MenuItem, ItemCategory, InvalidItemCategory} = require('../../domain/models');
const ModelValidationError = require('../errors/ModelValidationError');

function validateMenuItem(menuItem) {
    const {valid, errors} = menuItem.validate();
    if (valid === false) {
        throw new ModelValidationError({
            model: menuItem.constructor.name,
            errors: errors.reduce((acc, cur) => {
                return {
                    ...acc,
                    [cur.path[0]]: cur.message,
                };
            }, {}),
        });
    }
}

module.exports = function(repo) {
    return async function({name: itemName, category: categoryName}) {
        let category;
        try {
            category = ItemCategory.create(categoryName);
        } catch (e) {
            if (e instanceof InvalidItemCategory) {
                // Should not be in the use case
                throw new ModelValidationError('MenuItem', {
                    category: e.message,
                });
            }

            throw e;
        }

        let menuItem = new MenuItem({
            name: itemName,
            category: category,
        });
        validateMenuItem(menuItem);

        const menuItemId = await repo.createMenuItem(menuItem);
        menuItem = await repo.getMenuItemById(menuItemId);

        return menuItem;
    };
};
