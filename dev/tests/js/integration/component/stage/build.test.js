const stageFactory = require('stage');

describe('Stage', () => {
    const stage = stageFactory(jest);

    it('is loading data', () => {
        stage.setupWithContent('<div data-role="row"><div data-role="column"><span></span></div> <div data-role="column"></div></div>');

        return expect(stage.dataTree()).resolves.toEqual([{
            role: "row",
            _children: [
                {role: 'column', _children: []},
                {role: 'column', _children: []},
            ]
        }]);
    });

    it('is rendering data', () => {
        stage.setupWithContent('<div data-role="row"><div data-role="column"><span></span></div><div data-role="column"></div></div>');
        expect(stage.renderOutput()).resolves.toEqual('<div data-role="row"><div data-role="column"></div><div data-role="column"></div></div>');
    });
});
