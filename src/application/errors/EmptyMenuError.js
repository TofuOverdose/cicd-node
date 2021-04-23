class EmptyMenuError extends Error {
    constructor() {
        super('Menu is empty');
    }
};

module.exports = EmptyMenuError;
