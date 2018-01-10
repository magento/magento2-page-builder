module.exports = (jest) => {
    jest.mock(
        '::Magento_PageBuilder/js/component/loader',
        () => require('jest-magento2/fake-require'),
        {virtual: true}
    );
};
