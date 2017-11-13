function searchInPanel(keyword) {
    (require('setup-jquery'))(jest);
    (require('setup-loader'))(jest);
    initConfiguration();
    panel = new (require('js/component/stage/panel'))();
    panel.search(panel, {currentTarget: {value: keyword}});

    return panel.searchResults().map((value) => value.label());
}

function initConfiguration() {
    jest.mock(
        '::advanced-cms-init-config',
        () => {
            const fullConfiguration = Object.assign({}, require('init-config'));
            const contentType = (label, key, visible) => {
                return {
                    "name": key,
                    "label": label,
                    "icon": "icon-bluefoot-text",
                    "form": "text_form",
                    "contentType": "",
                    "group": "general",
                    "fields": {"textarea": {"default": "Type your text here..."}},
                    "visible": visible || visible === undefined,
                    "preview_template": "Gene_BlueFoot/component/block/preview/text.html",
                    "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
                    "component": "Gene_BlueFoot/js/component/block/block"
                };
            };

            fullConfiguration.contentTypes = {
                block: contentType('Block', 'block'),
                column: contentType('Column', 'column'),
                code: contentType('Code', 'code'),
                invisible_block: contentType('Invisible Block', 'invisible_block', false),
                oblong: contentType('Oblong', 'oblong'),
                segmented_block: contentType('Segmented Block', 'segmented_block')
            };

            return fullConfiguration;
        },
        {virtual: true}
    );
}

describe('searching in panel', () => {
    it('returns no results if no matches found', () => {
        expect(searchInPanel('not matching')).toEqual([]);
    });

    it('returns only visible blocks', () => {
        expect(searchInPanel('Block')).toEqual(
            ['Block', 'Segmented Block']
        );
    });

    it('returns results matching full phrase', () => {
        expect(searchInPanel('Segmented Block')).toEqual(
            ['Segmented Block']
        );
    });

    it('returns matches for one character in beginning of word', () => {
        expect(searchInPanel('b')).toEqual(
            ['Block', 'Segmented Block']
        );
    });

    it('returns matches for two characters in beginning of word', () => {
        expect(searchInPanel('co')).toEqual(
            ['Column', 'Code']
        );
    });

    it('returns matches for three characters in beginning of word', () => {
        expect(searchInPanel('blo')).toEqual(
            ['Block', 'Segmented Block']
        );
    });
});
