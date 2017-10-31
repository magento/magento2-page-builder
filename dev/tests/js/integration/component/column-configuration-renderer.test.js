const stageFactory = require('stage');

beforeEach(() => {
    (require('setup-stage'))(jest);
});

const givenContent = (content) => {
    const stage = stageFactory();
    stage.setupWithContent(content);
    let renderPromise = stage.renderOutput();
    return Object.assign(
        {},
        stage,
        {
            updateItem(path, data) {
                renderPromise = stage.updateItem(path, data)
                    .then(stage.renderOutput);
                return this;
            },
            thenRenders(expectedContent) {
                return expect(renderPromise).resolves.toEqual(expectedContent);
            }
        }
    );
};

describe('Column Configuration', () => {
    it('leaves as is if no properties provided', () => {
        const initialContent = '<div data-role="row"><div data-role="column"></div></div>';
        return givenContent(initialContent).thenRenders(initialContent);
    });

    it('preserves background color', () => {
        const initialContent = '<div data-role="row"><div data-role="column" style="background-color: rgb(204, 204, 204);"></div></div>';
        return givenContent(initialContent).thenRenders(initialContent);
    });

    it('adds background color on data modification', () => {
        return givenContent('<div data-role="row"><div data-role="column"></div></div>')
            .updateItem('', {background_color: '#000000'})
            .thenRenders('<div data-role="row"><div data-role="column" style="background-color: rgb(0, 0, 0);"></div></div>');
    });

    it('removes background color on data modification', () => {
        return givenContent('<div data-role="row"><div data-role="column" style="background-color: rgb(0, 0, 0);"></div></div>')
            .updateItem('', {background_color: ''})
            .thenRenders('<div data-role="row"><div data-role="column"></div></div>');
    });
});
