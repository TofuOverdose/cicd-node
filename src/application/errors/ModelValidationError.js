class ModelValidationError extends Error {
    constructor(model, errors) {
        super(`Validation for ${model} failed`);
        this.model = model;
        this.errors = errors;
    }
};

module.exports = ModelValidationError;
