/**
 * JS Unit Test for stage.js
 *
 * @author James Zetlen <jzetlen@magento.com>
 */
define([
    'ko',
    'bluefoot/stage'
], function (ko, Stage) {

    describe("Gene_BlueFoot/js/component/stage", function () {
        it("constructs from a parent, id, and content observableArray", function () {
            var parent = {
                confirmationDialog: function(options) {
                    options.actions.confirm();
                },
                showBorders: Math.random(),
                userSelect: Math.random(),
                loading: Math.random()
            };
            var stageId = Math.random();
            var stageContent = ko.observableArray([]);
            var stage = new Stage(parent, stageId, stageContent);
            expect(stage.id).toEqual(stageId);
            expect(stage.parent).toEqual(parent);
            expect(stage.stageContent).toEqual(stageContent);
            expect(stage.active).toBe(true);
            expect(stage.showBorders).toEqual(parent.showBorders);
            expect(stage.userSelect).toEqual(parent.userSelect);
            expect(stage.loading).toEqual(parent.loading);
            expect(stage.save).toBeTruthy();
        });

    });

});