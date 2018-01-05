/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage/structural/row.js
 */
define([
    'ko',
    'bluefoot/stage/structural/row',
    'bluefoot/config',
    'mageUtils'
], function (ko, Row, Config, utils) {
    'use strict';
    describe("Gene_BlueFoot/js/component/stage/structural/row", function () {
        var row, parent, stage;

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
                }
            };
            stage = {
                parent: parent,
                showBorders: ko.observable(false),
                save: {
                    observe: function () {}
                }
            };
            row = new Row(parent, stage);
        });

        it("can add column inside self", function () {
            var newColumn = row.addColumn();

            expect(row.children()).toContain(newColumn);
        });
    });

});