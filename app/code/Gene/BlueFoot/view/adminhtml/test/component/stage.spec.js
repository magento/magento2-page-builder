/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage.js
 */
define([
    'ko',
    'bluefoot/stage',
    'bluefoot/stage/structural/row'
], function (ko, Stage, Row) {
    'use strict';
    describe("Gene_BlueFoot/js/component/stage", function () {
        var stageId, stageContent, stage, parent;

        beforeEach(function () {
            parent = {
                confirmationDialog: function(options) {
                    options.actions.confirm();
                },
                showBorders: Math.random(),
                userSelect: Math.random(),
                loading: Math.random(),
                value: function () {}
            };
            stageId = Math.random();
            stageContent = ko.observableArray([]);
            stage = new Stage(parent, stageId, stageContent);
            stage.save.stageContentSubscription.dispose();
        });

        it("constructs from a parent, id, and content observableArray", function () {
            expect(stage.id).toEqual(stageId);
            expect(stage.parent).toEqual(parent);
            expect(stage.stageContent).toEqual(stageContent);
            expect(stage.active).toBe(true);
            expect(stage.showBorders).toEqual(parent.showBorders);
            expect(stage.userSelect).toEqual(parent.userSelect);
            expect(stage.loading).toEqual(parent.loading);
            expect(stage.save).toBeTruthy();
        });

        it("remove child removes correct child", function () {
            var removeChild = 1,
                input = [removeChild, 2],
                expected = [2];

            stage.stageContent(input);
            expect(stage.stageContent()).toEqual(input);
            stage.removeChild(removeChild);
            expect(stage.stageContent()).toEqual(expected);
        });

        it("can add child to stage content", function () {
            stage.addChild('testChild');
            expect(stage.stageContent()).toEqual(['testChild']);
        });

        it("can add child at correct index", function () {
            stage.stageContent([1,2,3,4,5]);
            stage.addChild('testChild', 3);
            expect(stage.stageContent()[3]).toEqual('testChild');
        });

        it("can add row to stage content", function () {
            stage.addRow(stage);
            expect(stage.stageContent()[0]).toEqual(jasmine.any(Row));
        });

        it("can add row to stage content with data", function () {
            stage.addRow(stage, 'testData');
            expect(stage.stageContent()[0].data()).toEqual('testData');
        });
    });

});