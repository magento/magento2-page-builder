module.exports = function (jest) {
    (require('./setup-jquery'))(jest);

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

    const fakeRequire = require('fake-require');

    fakeRequire.set('Gene_BlueFoot/js/component/block/block', require('js/component/block/block'));
    fakeRequire.set('Gene_BlueFoot/js/component/format/read/default', require('js/component/format/read/default'));
    fakeRequire.set('Gene_BlueFoot/js/utils/appearance-applier', require('js/utils/appearance-applier'));

    jest.mock(
        '::Gene_BlueFoot/js/component/loader',
        () => require('fake-require'),
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
