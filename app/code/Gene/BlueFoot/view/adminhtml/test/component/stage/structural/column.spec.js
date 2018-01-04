/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage/structural/column.js
 *
 */
define([
    'ko',
    'bluefoot/stage/structural/column',
    'bluefoot/config',
    'mageUtils'
], function (ko, Column, Config, utils) {
    'use strict';
    describe("Gene_BlueFoot/js/component/stage/structural/column", function () {
        var column, parent, stage;
        beforeEach(function () {
            parent = {
                confirmationDialog: function (options) {
                    options.actions.confirm();
                },
                id: Math.random(),
                children: ko.observableArray([]),
                addChild: function (child) {
                    this.children.push(child);
                },
                removeChild: function (child) {
                    utils.remove(this.children, child);
                },
            };
            stage = {
                parent: parent,
                showBorders: ko.observable(false),
                save: {
                    observe: function () {}
                }
            };
            parent.stage = stage;
            column = new Column(parent, stage);
        });

        it("copys column data to on duplicate", function () {
            var duplicate = new Column(parent, stage);

            column.data(['testData']);
            column.duplicateData(duplicate);
            expect(duplicate.data()).toEqual(['testData']);
        });

        it("can add column inside self", function () {
            var newColumn = column.addColumn();

            expect(column.children()).toContain(newColumn);
        });

        it("can insert a column to the left of an item", function () {
            var existingColumn = new Column(parent, stage),
                internalColumn = new Column(parent, stage),
                newColumn;

            existingColumn.parent.addChild(internalColumn);
            newColumn = column.insertColumnAtIndex('left', existingColumn);
            expect(existingColumn.parent.children()).toContain(newColumn);
            expect(existingColumn.parent.children()[0]).toEqual(newColumn);
        });

        it("can update column data with width", function () {
            column.updateColumnData({
                width: '0.6'
            });
            expect(column.widthClasses()).toEqual('test1');
            expect(column.columnDefinition()).toEqual(Config.getColumnDefinitionByBreakpoint('0.6'));
        });

        it("can update column data with className", function () {
            column.updateColumnData({
                className: 'test1'
            });
            expect(column.widthClasses()).toEqual('test1');
            expect(column.columnDefinition()).toEqual(Config.getColumnDefinitionByClassName('test1'));
        });
    });

});