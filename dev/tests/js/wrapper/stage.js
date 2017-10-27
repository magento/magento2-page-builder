module.exports = (jest, configuration) => {
    jest.mock(
        '::advanced-cms-init-config',
        () => require('init-config'),
        {virtual: true}
    );

    jest.mock(
        '::mage/translate',
        () => (text) => text,
        {virtual: true}
    );

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

    (require('./setup-jquery'))(jest);

    require('mutationobserver-shim');


    const ko = (require('knockout-bootstrap'))();

    const Build = require('js/component/stage/build');
    const Stage = require('js/component/stage');

    jest.mock('knockout', () => require('::ko'), {virtual: true});

    const fakeWysiwyg = new (require('wysiwyg'))();

    let build, stage, stageContent;

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
            stage = new Stage(fakeWysiwyg, stageContent = ko.observableArray());
            build.on('buildError', fakeWysiwyg.createErrorHandler());
            stage.build(build, build.parseStructure(content));
        },
        setupEmpty() {
            stage = new Stage(fakeWysiwyg, stageContent = ko.observableArray());
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
                fakeWysiwyg.waitForRender(resolve, reject);
            });
        }
    }
};
