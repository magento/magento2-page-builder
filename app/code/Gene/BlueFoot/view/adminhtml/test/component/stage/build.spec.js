/**
 * JS Unit Test for stage/save.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/build',
    'bluefoot/config',
    'hyperscript'
], function (ko, Build, Config, h) {
    describe("Gene_BlueFoot/js/component/stage/build", function () {
        var parent, stage, build;
        beforeEach(function () {
            parent = {
                addColumn: function () {}
            };
            stage = {
                stageContent: ko.observableArray([]),
                addRow: function () {},
                parent: parent
            };
            build = new Build();
        });

        it("parseStructure detects valid stage element", function () {
            var mockStructure = '<div ' + Config.getValue('dataRoleAttributeName') + '="stage"></div>',
                structure = build.parseStructure(mockStructure);
            expect(structure.constructor.name).toEqual('HTMLDivElement');
            expect(structure.getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('stage');
        });

        it("parseStructure returns false on invalid structure", function () {
            var mockStructure = '<div data-invalid-role="stage"></div>',
                structure = build.parseStructure(mockStructure);
            expect(structure).toEqual(false);
        });

        it("buildStage returns self to allow chaining", function () {
            expect(build.buildStage(stage)).toEqual(jasmine.any(Build));
        });

        it("getElementData returns valid object", function () {
            var element = document.createElement('div'),
                script = document.createElement('script'),
                mockData = {'mockData': true};
            script.setAttribute('type', 'text/advanced-cms-data');
            script.innerHTML = JSON.stringify(mockData);
            element.append(script);
            var parsed = build.getElementData(element);
            expect(parsed).toEqual(jasmine.any(Object));
            expect(parsed).toEqual(mockData);
        });

        it("getElementData returns empty object on invalid element", function () {
            var element = document.createElement('div'),
                parsed = build.getElementData(element);
            expect(parsed).toEqual(jasmine.any(Object));
            expect(parsed).toEqual({});
        });

        it("parseAndBuildElement returns Promise", function () {
            var parentData = {},
                mockParent = {};
            parentData[Config.getValue('dataRoleAttributeName')] = 'stage';
            var element = h('div', parentData);
            var buildElement = build.parseAndBuildElement(element, mockParent);
            expect(buildElement).toEqual(jasmine.any(Promise));
        });

        it("parseAndBuildElement requires data role attribute to be present", function (done) {
            var element = h('div');
            build.parseAndBuildElement(element).then(function () {
                done(new Error('parseAndBuildElement should reject when data role attribute isn\'t present.'));
            }, function (error) {
                expect(error).toEqual(jasmine.any(Error));
                done();
            });
        });

        it("getElementChildren will retrieve direct children successfully", function () {
            var parentData = {},
                childData = {};
            parentData[Config.getValue('dataRoleAttributeName')] = 'stage';
            childData[Config.getValue('dataRoleAttributeName')] = 'row';
            var element = h('div', parentData,
                h('div', childData),
                h('div', childData)
            );
            var children = build.getElementChildren(element);
            expect(children).toEqual(jasmine.any(Array));
            expect(children.length).toEqual(2);
            expect(children[0].getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('row');
            expect(children[1].getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('row');
        });

        it("getElementChildren will retrieve deeper children successfully", function () {
            var parentData = {},
                childData = {};
            parentData[Config.getValue('dataRoleAttributeName')] = 'stage';
            childData[Config.getValue('dataRoleAttributeName')] = 'deep-child';
            var element = h('div', parentData,
                h('div',
                    h('div',
                        h('div', childData),
                        h('div', childData)
                    )
                )
            );
            var children = build.getElementChildren(element);
            expect(children).toEqual(jasmine.any(Array));
            expect(children.length).toEqual(2);
            expect(children[0].getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('deep-child');
            expect(children[1].getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('deep-child');
        });

        it("getElementChildren will always return an array on invalid element", function () {
            var invalidElement = h('div'),
                children = build.getElementChildren(invalidElement);
            expect(children).toEqual(jasmine.any(Array));
        });

        it("buildElement returns promise", function () {
            var mockParent = {
                addRow: function () {},
                addColumn: function () {}
            };
            expect(build.buildElement('stage', {}, mockParent)).toEqual(jasmine.any(Promise));
            expect(build.buildElement('row', {}, mockParent)).toEqual(jasmine.any(Promise));
            expect(build.buildElement('column', {}, mockParent)).toEqual(jasmine.any(Promise));
        });
    });
});
