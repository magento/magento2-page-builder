/**
 * JS Unit Test for stage/structural/abstract.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/edit',
    'mageUtils'
], function (ko, AbstractStructural, Edit, utils) {
    describe("Gene_BlueFoot/js/component/stage/structural/abstract", function () {
        var abstract, parent, stage;
        beforeEach(function () {
            parent = {
                confirmationDialog: function(options) {
                    options.actions.confirm();
                },
                id: Math.random(),
                children: ko.observableArray([]),
                addChild: function (child) {
                    this.children.push(child);
                },
                removeChild: function (child) {
                    utils.remove(this.children, child);
                }
            };
            stage = {
                parent: parent,
                showBorders: ko.observable(false),
                save: {
                    observe: function () {}
                }
            };
            AbstractStructural.prototype.initSubscriptions = function () { };
            abstract = new AbstractStructural(parent, stage);
        });

        it("constructs with default options", function () {
            expect(abstract.options.options().length).not.toBeLessThan(0);
        });

        it("duplicate copies data into new instance", function (done) {
            var mockData = {'testDuplicate': 1};
            abstract.data(mockData);
            abstract.duplicate(false, abstract, function (duplicate) {
                expect(duplicate.data()).toEqual(mockData);
                done();
            });
        });

        it("duplicate copies children into new instance", function () {
            var mockChildDuplicate = {
                'childDuplicate': 1
            };
            abstract.children.push({
                duplicate: function ($data, structural, callbackFn) {
                    return callbackFn(mockChildDuplicate);
                }
            });
            abstract.duplicate(false, abstract, function (duplicate) {
                expect(duplicate.children()[0]).toEqual(mockChildDuplicate);
            });
        });

        it("duplicate data duplicates data correctly", function () {
            var testData = {'testData': 1};
            abstract.data(testData);
            var duplicate = {
                data: ko.observable({})
            };
            abstract.duplicateData(duplicate);
            expect(duplicate.data()).toEqual(testData);
        });

        it("duplicate arguments is array and contains parent & stage", function () {
            expect(abstract.duplicateArgs()).toEqual(jasmine.any(Array));
            expect(abstract.duplicateArgs()).toContain(parent);
            expect(abstract.duplicateArgs()).toContain(stage);
        });

        it("can add child to stage content", function () {
            abstract.addChild('testChild');
            expect(abstract.children()).toEqual(['testChild']);
        });

        it("can add child at correct index", function () {
            abstract.children([1,2,3,4,5]);
            abstract.addChild('testChild', 3);
            expect(abstract.children()[3]).toEqual('testChild');
        });

        it("remove child removes correct child", function () {
            var removeChild = 1,
                input = [removeChild, 2],
                expected = [2];
            abstract.children(input);
            expect(abstract.children()).toEqual(input);
            abstract.removeChild(removeChild);
            expect(abstract.children()).toEqual(expected);
        });

        it("remove self from parent", function () {
            parent.addChild(abstract);
            expect(parent.children()[0]).toEqual(abstract);
            var structural = {
                parent: parent
            };
            abstract.remove(false, structural);
            expect(parent.children()).not.toContain(abstract);
        });

        it("can update wrapper style with key & value", function () {
            expect(abstract.wrapperStyle()).toEqual({});
            abstract.updateWrapperStyle('testKey', 'testValue');
            expect(abstract.wrapperStyle()).toEqual({'testKey': 'testValue'});
        });

        it("can update wrapper style with object", function () {
            expect(abstract.wrapperStyle()).toEqual({});
            var testData = {'testKey': 'testValue'};
            abstract.updateWrapperStyle(testData);
            expect(abstract.wrapperStyle()).toEqual(testData);
        });
    });
});