const EmptyMenuError = require('../errors/EmptyMenuError');

module.exports = function(repo) {
    return async function getMenu() {
        const menu = await repo.getMenuItems();
        if (menu.length === 0) {
            throw new EmptyMenuError();
        }

        return menu;
    };
};
