const repl = require('repl');
const EmptyMenuError = require('../../application/errors/EmptyMenuError');
const ModelValidationError = require('../../application/errors/ModelValidationError');

const container = require('../../infra/service-container');
const getMenu = require('../../application/use-cases/GetMenu')(container.database);
const createMenuItem = require('../../application/use-cases/CreateMenuItem')(container.database);

function start() {
    const main = repl.start();

    main.defineCommand('list', {
        help: 'List the menu items',
        action: async() => {
            main.clearBufferedCommand();
            try {
                const menu = await getMenu();
                menu.forEach(item => console.log(`${item.get('id')}\t${item.get('name')}\t${item.get('category').get('name')}`));
            } catch (e) {
                if (e instanceof EmptyMenuError) {
                    console.log('The menu is empty');
                    return;
                }

                console.log('Sorry, something went wrong...');
            }
        },
    });

    main.defineCommand('add', {
        help: 'Add new item to menu',
        action: async(input) => {
            main.clearBufferedCommand();
            const [itemName, categoryName] = input.split(' ');
            if (!itemName || !categoryName) {
                console.log('To add menu item type: ".add [new item name] [item category]"');
                return;
            }

            try {
                const menuItem = await createMenuItem({name: itemName, category: categoryName});
                console.log('Added new menu item successfully', JSON.stringify(menuItem.toJSON()));
            } catch (e) {
                if (e instanceof ModelValidationError) {
                    console.log('Could not add item:');
                    Object.entries(e.errors).forEach(([_, error]) => console.log(error));
                    return;
                }

                console.log('Sorry, something went wrong...');
            }
        },
    });
}

module.exports = {
    start,
};
