const stageFactory = require('stage');

const columnConfiguration = (columnConfig) => {
    return Object.assign({
        "background_attachment": "fixed",
        "background_color": "",
        "background_image": "",
        "background_position": "top_aligned",
        "background_repeat": "0",
        "background_size": "auto",
        "min_height": "",
        "role": "column",
        "css_classes": [],
        "_children": []
    }, columnConfig);
};

describe('Column Configuration Parser', () => {
    const stage = stageFactory(jest);

    it('defaults to standard configuration if no properties provided', () => {
        stage.setupWithContent('<div data-role="row"><div data-role="column"></div></div>');
        return expect(stage.dataTree()).resolves.toEqual([
            expect.objectContaining({
                role: 'row',
                _children: [
                    columnConfiguration({})
                ]
            })
        ])
    });

    it('parses background from style tag', () => {
        stage.setupWithContent('<div data-role="row"><div data-role="column" style="background-attachment: scroll; background-color: rgb(204,204,204);"></div></div>');
        return expect(stage.dataTree()).resolves.toEqual([
            expect.objectContaining({
                role: 'row',
                _children: [
                    columnConfiguration({
                        "background_color": "#cccccc",
                        "background_attachment": "scroll"
                    })
                ]
            })
        ])
    });
});
