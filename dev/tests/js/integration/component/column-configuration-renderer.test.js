const stageFactory = require('stage');

beforeEach(() => {
    (require('setup-stage'))(jest);
});

describe('Column Configuration Renderer', () => {
    it('defaults to standard configuration if no properties provided', () => {
        const stage = stageFactory();
        stage.setupWithContent('<div data-role="row"><div data-role="column"></div></div>');
        return expect(stage.renderOutput()).resolves.toEqual('<div data-role="row"><div data-role="column"></div></div>');
    });

    it('adds background position and background attachment if background color is set', () => {
        const stage = stageFactory();
        stage.setupWithContent('<div data-role="row"><div data-role="column" style="background-color: rgb(204,204,204);"></div></div>');
        return expect(stage.renderOutput()).resolves.toEqual('<div data-role="row"><div data-role="column" style="background-color: rgb(204, 204, 204); background-size: auto; background-repeat: repeat; background-attachment: fixed;"></div></div>');
    });

});
