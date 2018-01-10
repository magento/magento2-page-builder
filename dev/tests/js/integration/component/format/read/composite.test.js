const compositeReader = () => new (require('js/component/format/read/composite'))();

beforeEach(() => {
    jest.mock('::advanced-cms-init-config', () => require('init-config'), {virtual: true});
    jest.mock('::Magento_PageBuilder/js/component/loader', () => require('jest-magento2/fake-require'));
});
describe('Composite reader of attributes', () => {

    it('Can read data-role attribute', () => {
        const element = document.createElement('div');
        element.setAttribute('data-role', 'column');

        const elementData = compositeReader().read(element);
        expect(elementData).resolves.toEqual(
            expect.objectContaining(
                {role: 'column'}
            )
        );
    });

    it('Can read data-appearance and style attribute', () => {
        const element = document.createElement('div');
        element.setAttribute('data-appearance', 'align-top');
        element.setAttribute('style', 'margin-top: 1px; min-height: 100px;');

        const elementData = compositeReader().read(element);
        expect(elementData).resolves.toEqual(
            expect.objectContaining(
                {
                    appearance: 'align-top',
                    margin_top: '1',
                    min_height: '100'
                }
            )
        );
    });

    it('Can read heading specific data', () => {
        const element = document.createElement('h2');
        element.setAttribute('data-role', 'heading');

        const elementData = compositeReader().read(element);
        expect(elementData).resolves.toEqual(
            {
                role: 'heading',
                heading_type: 'H2'
            }
        );
    });
});
