describe('searching in panel', () => {
    (require('../../../wrapper/setup-jquery'))(jest);

    jest.mock('::advanced-cms-init-config', () => require('init-config'), {virtual: true});
    jest.mock('::Gene_BlueFoot/js/component/loader', () => require('jest-magento2/fake-require'));

    const fakeRequire = require('jest-magento2/fake-require');
    fakeRequire.set('Gene_BlueFoot/js/component/block/preview/block', require('js/component/block/preview/block'));
    fakeRequire.set('Gene_BlueFoot/js/component/block/preview/image', require('js/component/block/preview/image'));

    let panel;

    beforeEach(() => {
        (require('setup-stage'))(jest);
        panel = new (require('::js/component/stage/panel'))();
    });

    it('returns matches for three characters', () => {
        const element = jQuery('<input>');
        element.bind('keyup', function(event) {
            this.value = 'blo';
            panel.search(panel, event);
            const searchResults = panel.searchResults();
            for (let i = 0; i < searchResults.length; i++) {
                const label = searchResults[i].config.label;
                expect(label).toEqual(expect.stringMatching(/Blo/));
            }
        });
        var e = jQuery.Event('keyup');
        jQuery(element).trigger(e);
    });
    it('returns matches for one character', () => {
        const element = jQuery('<input>');
        element.bind('keyup', function(event) {
            this.value = 'b';
            panel.search(panel, event);
            const searchResults = panel.searchResults();
            for (let i = 0; i < searchResults.length; i++) {
                const label = searchResults[i].config.label;
                expect(label).toEqual(expect.stringMatching(/B/));
            }
        });
        var e = jQuery.Event('keyup');
        jQuery(element).trigger(e);
    });
    it('returns no matches', () => {
        const element = jQuery('<input>');
        element.bind('keyup', function(event) {
            this.value = 'abcdef';
            panel.search(panel, event);
            const searchResultsLength = panel.searchResults().length;
            expect(searchResultsLength).toEqual(0);
        });
        var e = jQuery.Event('keyup');
        jQuery(element).trigger(e);
    });
});
