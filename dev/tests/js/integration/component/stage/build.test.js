jest.mock(
    '::advanced-cms-init-config',
    () => {
        return {
            column: 6,
            column_options: [],
            column_definitions: [],
            contentTypes: {
                row: {role: 'row'},
                column: {role: 'column'}
            }
        };
    },
    {virtual: true}
);

jest.mock(
    '::mage/translate',
    () => { return (t) => t },
    {virtual: true}
);

jest.mock(
    '::moduleLoader',
    () => { return function (dependency) {
        return require('::' + dependency);
    } },
    {virtual: true}
);

const config = require('component/config');
const Stage = require('component/stage');
const Build = require('component/stage/build');
const ko = require('::ko');

const wysiwyg = require('../../../stubs/wysiwyg');

/**
 * @jest-environment jsdom
 */
describe('Build', () => {
    it('set configuration', (done) => {
        jest.useFakeTimers();
        const build = new Build();
        const structure = build.parseStructure('<div data-role="row">\n        <div data-role="column"></div>\n    </div>');

        const stageContent = ko.observableArray([]);

        const stage = new Stage(wysiwyg(), stageContent);

        stage.build(build, structure);
        stage.on('stageReady', () => {
            expect(stageContent()).toEqual(undefined);
            done();
        });

        jest.runAllTimers();

        //build.buildStage(stage, stageContent);


    });

    it('dataset works', () => {
        const div = document.createElement('div');
        expect(div.dataset).toEqual({});
    })
});
