/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage/save.js
 *
 */
define([
    'ko',
    'bluefoot/stage/save',
    'bluefoot/config'
], function (ko, Save, Config) {
    'use strict';
    describe("Gene_BlueFoot/js/component/stage/save", function () {
        var stage, save, stageData, valueFn;

        beforeEach(function () {
            stageData = ko.observable({
                'test': 1
            });
            stage = {
                stageContent: ko.observableArray([]),
                parent: {},
                serializeRole: 'stage',
                dataEntityData: [stageData]
            };
            valueFn = function () { };
            save = new Save(stage, valueFn);
        });

        it("will call update on stageContent change", function () {
            spyOn(save, "update");
            stage.stageContent.push(1);
            expect(save.update).toHaveBeenCalled();
        });

        it("will run observe knockout observable", function () {
            var observable = ko.observable('testValue');

            spyOn(save, "update");
            save.observe(observable);
            observable('newValue');
            expect(save.update).toHaveBeenCalled();
        });

        it ("will throw error if non observable is passed to observe fn", function () {
            var nonObservable = {};

            expect(function () {
                save.observe([nonObservable]);
            }).toThrow();
        });

        it ("commit updates valueFn with valid stage element", function (done) {
            spyOn(save, "valueFn").and.callFake(function (result) {
                expect(result).toContain(Config.getValue('dataRoleAttributeName') + '="stage"');
                done();
            });
            save.commit();
        });

        it ("serialize stage creates HTMLDivElement", function (done) {
            save.serializeStage().then(function (structure) {
                expect(structure.constructor.name).toEqual('HTMLDivElement');
                done();
            });
        });

        it ("serialize stage element has [data-role] of stage", function (done) {
            save.serializeStage().then(function (structure) {
                expect(structure.getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('stage');
                done();
            });
        });

        it ("serialize stage element contains valid <script /> entity data", function (done) {
            save.serializeStage().then(function (structure) {
                var entityData = JSON.parse(structure.childNodes.item(0).innerHTML);

                expect(structure.childNodes.length).toEqual(1);
                expect(structure.childNodes.item(0).tagName).toEqual('SCRIPT');
                expect(entityData).toEqual(jasmine.any(Object));
                expect(entityData).toEqual(stageData());
                done();
            });
        });

        it ("serializeObject requires serializeRole on object", function (done) {
            save.serializeObject({}).then(function () {
                done(new Error('Promise should not complete'));
            }, function () {
                done();
            });
        });

        it ("buildData returns valid <script /> element for object", function () {
            var data = ko.observable({'mockData': true}),
                object = {
                    dataEntityData: [data]
                };
            var builtDataArray = save.buildData(object);

            expect(builtDataArray.length).toEqual(1);
            expect(builtDataArray[0].constructor.name).toEqual('HTMLScriptElement');
            expect(JSON.parse(builtDataArray[0].innerHTML)).toEqual(data());
        });

        it ("buildData pushes invalid data into array", function () {
            var data = ko.observable({'mockData': true}),
                object = {
                    dataEntityData: [data]
                };
            var builtDataArray = save.buildData(object, {'child': true});

            expect(builtDataArray.length).toEqual(2);
        });

        it ("retrieveObjectData return all data for object", function () {
            var mainData = ko.observable({'mockData': true}),
                subsequentData = ko.observable({'subsequentData': true}),
                object = {
                    dataEntityData: [mainData, subsequentData]
                };
            var objectData = save.retrieveObjectData(object);

            expect(objectData).toEqual(jasmine.any(Object));
            expect(objectData['mockData']).toBeTruthy();
            expect(objectData['subsequentData']).toBeTruthy();
        });

        it ("retrieveObjectData ignores specific attributes", function () {
            var mainData = ko.observable({'mockData': true, 'ignored': true}),
                object = {
                    dataEntityData: [mainData],
                    dataEntityDataIgnore: ['ignored']
                };
            var objectData = save.retrieveObjectData(object);

            expect(objectData).toEqual(jasmine.any(Object));
            expect(objectData['mockData']).toBeTruthy();
            expect(objectData['ignored']).toBeUndefined();
        });

        it ("buildStructureElement returns valid HTMLDivElement", function () {
            var element = save.buildStructureElement({}, []);

            expect(element.constructor.name).toEqual('HTMLDivElement');
        });

        it ("buildStructureElement add element attributes", function () {
            var element = save.buildStructureElement({
                'data-test': 'test'
            }, []);

            expect(element.hasAttribute('data-test')).toBeTruthy();
            expect(element.getAttribute('data-test')).toEqual('test');
        });

        it ("buildStructureElement inserts child elements", function () {
            var children = [document.createElement('div')],
                element = save.buildStructureElement({}, children);

            expect(element.childNodes.length).toEqual(1);
        });

        it ("retrieveChildren retrieves children from object", function (done) {
            var childObject = {
                    serializeRole: 'mockChild'
                },
                children = ko.observableArray([childObject]),
                object = {
                    serializeChildren: [children]
                };

            save.retrieveChildren(object).then(function (result) {
                expect(result).toEqual(jasmine.any(Array));
                expect(result.length).toEqual(1);
                expect(result[0].getAttribute(Config.getValue('dataRoleAttributeName'))).toEqual('mockChild');
                done();
            });
        });

        it ("retrieveChildren returns valid Array when no children are present", function (done) {
            var children = [];

            save.serializeChildren(children).then(function (result) {
                expect(result).toEqual(jasmine.any(Array));
                expect(result.length).toEqual(0);
                done();
            });
        });

        it ("serializeChildren throws error on invalid serializeChildren value", function (done) {
            var children = [{'invalidObject': true}];

            save.serializeChildren(children).then(function () {
                done(new Error('serializeChildren should throw error'));
            }, function () {
                done();
            });
        });

        it("deleted items are recorded in save.deleted", function () {
            save.delete('testDelete');
            expect(save.deleted[0]).toEqual('testDelete');
        });
    });
});
