const jquery = require('jquery');

const setupJquery = (jest) => {
    jquery(global.window);
    global.jQuery = jquery.noConflict();
    jest.setMock('::jquery', jquery);
    jest.mock('::jquery/ui', () => require('jquery-ui'), {virtual: true});
};

module.exports = setupJquery;
