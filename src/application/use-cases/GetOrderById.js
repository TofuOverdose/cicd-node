const NotFoundError = require('../errors/NotFoundError');
const {Order} = require('../../domain/models');

module.exports = function(repo) {
    return async function getOrderById(orderId) {
        const order = await repo.getOrderById(orderId);
        if (order === undefined) {
            throw new NotFoundError(Order.consturctor.name, orderId);
        }

        return order;
    };
};
