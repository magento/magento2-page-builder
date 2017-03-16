/**
 * JS Unit Test for stage/save.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/save'
], function (ko, Save) {
    describe("Gene_BlueFoot/js/component/stage/save", function () {
        var stage, save;
        beforeEach(function () {
            stage = {
                stageContent: ko.observableArray([]),
                parent: {
                    value: function () {}
                },
                toJSON: function () {
                    return {'test': 1}
                }
            };
            save = new Save(stage);
            save.input = {
                val: function () {
                    return '{"test":1}';
                }
            };
        });

        it("will call update on stageContent change", function (done) {
            var originalUpdate = save.update;
            save.update = function () {
                done();
            };
            stage.stageContent.push(1);
            save.update = originalUpdate;
        });

        it("update will update stage parent value", function (done) {
            stage.parent.value = function () {
                done();
            }
            save.update();
        });

        it("will return json string when converting the stage", function () {
            expect(save.stageToJSON()).toEqual('{"test":1}');
        });

        it("deleted items are recorded in save.deleted", function () {
            save.delete('testDelete');
            expect(save.deleted[0]).toEqual('testDelete')
        });

        it("will return object when getting data from input", function () {
            expect(save.getData()).toEqual({'test': 1});
        });
    });
});
