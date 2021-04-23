class NotFoundError extends Error {
    constructor(modelClassName, id) {
        super(`Entry of ${modelClassName} by identifier ${id} wasn't found`);
        this.modelClassName = modelClassName;
        this.id = id;
    }
}

module.exports = NotFoundError;
