const prefix = 'CF_';

module.exports = function(key, fallback) {
    const k = prefix + key.toUpperCase().replace('.', '_');
    return process.env[k] || fallback;
};
