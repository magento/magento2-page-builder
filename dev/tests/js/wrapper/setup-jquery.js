const jquery = require('jquery');

const setupJquery = (jest) => {
    jquery(global.window);
    global.jQuery = jquery.noConflict();

    jest.mock('::jquery', () => require('jquery'), {virtual: true});
    jest.mock('::jquery/ui', () => require('jquery-ui'), {virtual: true});
};

module.exports = setupJquery;
