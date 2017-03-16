/**
 * JS Unit Test for stage/structural/row.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/row',
    'bluefoot/config',
    'mageUtils'
], function (ko, Row, Config, utils) {
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
                showBorders: ko.observable(false)
            };
            row = new Row(parent, stage);
        });

        it("can add column inside self", function () {
            var newColumn = row.addColumn();
            expect(row.children()).toContain(newColumn);
        });

        it("will return a valid JSON object", function () {
            expect(row.toJSON()).toEqual({
                'formData': {},
                'type': 'row'
            });
        });
    });

});