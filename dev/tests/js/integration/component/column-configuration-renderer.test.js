const stageFactory = require('stage');

describe('Column Configuration Renderer', () => {
    const stage = stageFactory(jest);

    it('defaults to standard configuration if no properties provided', () => {
        stage.setupWithContent('<div data-role="row"><div data-role="column"></div></div>');
        return expect(stage.renderOutput()).resolves.toEqual('<div data-role="row"><div data-role="column"></div></div>');
    });

    it('adds background position and background attachment if background color is set', () => {
        stage.setupWithContent('<div data-role="row"><div data-role="column" style="background-color: rgb(204,204,204);"></div></div>');
        return expect(stage.renderOutput()).resolves.toEqual('<div data-role="row"><div data-role="column" style="background-color: rgb(204, 204, 204); background-size: auto; background-repeat: repeat; background-attachment: fixed;"></div></div>');
    });

});
