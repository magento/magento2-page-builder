/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage/structural/abstract.js
 *
 */
define([
    'ko',
    'bluefoot/event-emitter',
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/edit',
    'mageUtils'
], function (ko, EventEmitter, AbstractStructural, Edit, utils) {
    'use strict';
    describe("Gene_BlueFoot/js/component/stage/structural/abstract", function () {
        var abstract, parent, stage;

        beforeEach(function () {
            parent = Object.assign(
                new EventEmitter(),
                {
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
                }
            );
            stage = Object.assign(
                new EventEmitter(),
                {
                    parent: parent,
                    showBorders: ko.observable(false),
                    save: {
                        observe: function () {}
                    }
                }
            );
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

        it("duplicate copies children into new instance", function (done) {
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
                done();
            });
        });

        it("duplicate data duplicates data correctly", function () {
            var testData = {'testData': 1};
            var duplicate = {
                data: ko.observable({})
            };

            abstract.data(testData);
            abstract.duplicateData(duplicate);
            expect(duplicate.data()).toEqual(testData);
        });

        it("duplicate arguments is array and contains parent & stage", function () {
            expect(abstract.duplicateArgs()).toEqual(jasmine.any(Array));
            expect(abstract.duplicateArgs()).toContain(parent);
            expect(abstract.duplicateArgs()).toContain(stage);
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

        it("remove calls blockRemoved event", function (done) {
            var structural;

            parent.addChild(abstract);
            expect(parent.children()[0]).toEqual(abstract);
            structural = {
                parent: parent
            };
            parent.on('blockRemoved', function () {
                done();
            });
            abstract.remove(false, structural);
        });

        it("can update wrapper style with key & value", function () {
            expect(abstract.wrapperStyle()).toEqual({});
            abstract.updateWrapperStyle('testKey', 'testValue');
            expect(abstract.wrapperStyle()).toEqual({'testKey': 'testValue'});
        });

        it("can update wrapper style with object", function () {
            var testData = {'testKey': 'testValue'};

            expect(abstract.wrapperStyle()).toEqual({});
            abstract.updateWrapperStyle(testData);
            expect(abstract.wrapperStyle()).toEqual(testData);
        });
    });
});