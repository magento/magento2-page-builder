module.exports = {
    process(code) {
        console.log(code);
        return 'module.exports = ' + JSON.stringify(code) + ';';
    }
};
