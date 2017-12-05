module.exports = function (jest) {
    (require('./setup-jquery'))(jest);
    (require('./setup-loader'))(jest);

    jest.mock(
        '::advanced-cms-init-config',
        () => require('init-config'),
        {virtual: true}
    );

    jest.mock(
        '::mage/translate',
        () => (text) => text,
        {virtual: true}
    );



    jest.mock(
        '::domReady!', () => true, {virtual: true}
    );

    jest.mock('::mage/calendar', () => {}, {virtual: true});

    require('mutationobserver-shim');

    (require('knockout-bootstrap'))();

    jest.mock('knockout', () => require('::ko'), {virtual: true});
};
