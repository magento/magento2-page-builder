module.exports = () => {
    const Build = require('js/component/stage/build');
    const Stage = require('js/component/stage');

    const fakeWysiwyg = new (require('wysiwyg'))();
    const ko = require('::ko');

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
