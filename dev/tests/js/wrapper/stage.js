module.exports = (jest, configuration) => {
    jest.setMock(
        '::advanced-cms-init-config',
        Object.assign({}, require('advanced-cms-init-config'), configuration || {})
    );

    jest.setMock('::mage/translate', (text) => text);

    const fakeRequire = require('fake-require');

    fakeRequire.set('Gene_BlueFoot/js/component/block/block', require('js/component/block/block'));
    fakeRequire.set('Gene_BlueFoot/js/component/format/read/default', require('js/component/format/read/default'));

    jest.mock(
        '::Gene_BlueFoot/js/component/loader',
        () => require('fake-require'),
        {virtual: true}
    );

    jest.mock(
        '::domReady!', () => true, {virtual: true}
    );

    jest.mock('::mage/calendar', () => {}, {virtual: true});


    require('mutationobserver-shim');



    (require('./setup-jquery'))(jest);



    const ko = (require('knockout-bootstrap'))();

    const Build = require('js/component/stage/build');
    const Stage = require('js/component/stage');

    jest.mock('knockout', () => require('::ko'), {virtual: true});

    const fakeWysiwyg = new (require('wysiwyg'))();

    let build, stage, stageContent = ko.observableArray();

    function dataItem(element) {
        const data = stage.store.get(element.id);

        data.role = element.config ? element.config.name : data.role;

        if (element.children) {
            data._children = ko.utils.arrayMap(element.children(), dataItem);
        }

        return data;
    }

    return {
        setupWithContent(content) {
            build = new Build();
            stage = new Stage(fakeWysiwyg, stageContent);
            build.on('buildError', fakeWysiwyg.createErrorHandler());
            stage.build(build, build.parseStructure(content));
        },
        setupEmpty() {
            stage = new Stage(fakeWysiwyg, stageContent);
            stage.build();
        },
        dataTree() {
            return new Promise((resolve, reject) => {
                fakeWysiwyg.waitForReady(
                    () => {
                        resolve(ko.utils.arrayMap(stageContent(), dataItem));
                    },
                    reject
                );
            });
        },
        renderOutput() {
            return new Promise((resolve, reject) => {
                wysiwyg.waitForRender(resolve, reject);
            });
        }
    }
};
