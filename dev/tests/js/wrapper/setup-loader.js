module.exports = (jest) => {
    jest.mock(
        '::Gene_BlueFoot/js/component/loader',
        () => require('jest-magento2/fake-require'),
        {virtual: true}
    );
};
