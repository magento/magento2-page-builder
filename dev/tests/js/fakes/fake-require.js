module.exports = function (dependencies, factory) {
    const resolvedDependencies = dependencies.map(
        (dependency) => {
            return module.exports.loadDependency(dependency);
        }
    );

    return factory(...resolvedDependencies);
};

module.exports.loadDependency = (name) => {
    if (!this.dynamicComponents[name]) {
        const filePath = require.resolve(name);
        if (filePath.match(/.html$/)) {
            console.log(filePath);
        }

        throw new Error('Dynamic dependency is not found: ' + name);
    }

    return this.dynamicComponents[name];
};

module.exports.set = (name, item) => {
    this.dynamicComponents[name] = item;
};

module.exports.reset = () => {
    this.dynamicComponents = {};
};

module.exports.reset();
