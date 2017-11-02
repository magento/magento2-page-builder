module.exports = () => {
    const Build = require('::Gene_BlueFoot/js/component/stage/build');
    const Stage = require('::Gene_BlueFoot/js/component/stage');

    const fakeWysiwyg = new (require('wysiwyg'))();
    const ko = require('::ko');

    let build, stage, stageContent;

    function dataItem(element) {
        const data = stage.store.get(element.id);

        data.role = element.config ? element.config.name : data.role;
        //data.id = element.id;

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
        updateItem(path, data) {
            return this.dataTree().then((dataTree) => {
                stage.store.update(dataTree[0]._children[0].id, data);
            });
        },
        renderOutput() {
            return new Promise((resolve, reject) => {
                fakeWysiwyg.waitForRender(resolve, reject);
            });
        }
    }
};
