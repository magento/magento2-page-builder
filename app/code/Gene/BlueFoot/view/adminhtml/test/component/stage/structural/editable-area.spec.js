/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage/structural/editable-area.js
 */
define([
    'ko',
    'bluefoot/event-emitter',
    'bluefoot/stage/structural/editable-area',
    'bluefoot/block/factory'
], function (ko, EventEmitter, EditableArea, BlockFactory) {
    'use strict';
    describe("Gene_BlueFoot/js/component/stage/structural/editable-area", function () {
        var editable, observable, stage, event, mockBlockConfig,
            blockFactory = new BlockFactory();

        beforeEach(function () {
            stage = {
                save: {
                    observe: function () {},
                    update: function () {}
                }
            };
            observable = ko.observableArray([]);
            editable = new EditableArea(observable, stage);
            event = {};
            mockBlockConfig = {
                config: {
                    editOnInsert: false,
                    code: 'testBlock'
                }
            };
        });

        it("can add child to observable", function () {
            editable.addChild('testChild');
            expect(observable()).toEqual(['testChild']);
        });

        it("can add child at correct index", function () {
            observable([1,2,3,4,5]);
            editable.addChild('testChild', 3);
            expect(observable()[3]).toEqual('testChild');
        });

        it("creates a new instance of a block on drop", function (done) {
            editable.onBlockDropped(event, {
                block: mockBlockConfig
            }).then(function (block) {
                expect(observable()[0]).toEqual(block);
                done();
            });
        });

        it("creates a new instance of a block on drop at correct index", function (done) {
            observable([1,2,3,4,5]);
            editable.onBlockDropped(event, {
                block: mockBlockConfig,
                index: 2
            }).then(function (block) {
                expect(observable()[2]).toEqual(block);
                done();
            });
        });

        it("can add an existing block instance as child", function (done) {
            blockFactory.create(mockBlockConfig.config, editable, stage).then(function (block) {
                block.on('blockMoved', function () {
                    expect(observable()[0]).toEqual(block);
                    done();
                });
                editable.onBlockInstanceDropped(event, {
                    blockInstance: block
                });
            });
        });

        it("can add an existing block instance as child at correct index", function (done) {
            observable([1,2,3,4,5]);
            blockFactory.create(mockBlockConfig.config, editable, stage).then(function (block) {
                block.on('blockMoved', function () {
                    expect(observable()[2]).toEqual(block);
                    done();
                });
                editable.onBlockInstanceDropped(event, {
                    blockInstance: block,
                    index: 2
                });
            });
        });

        it("can remove previously added block", function (done) {
            blockFactory.create(mockBlockConfig.config, editable, stage).then(function (block) {
                observable.push(block);
                editable.onBlockRemoved(event, {
                    block: block
                });
                expect(observable.length).toEqual(0);
                done();
            });
        });

        it("can sort previously added block", function (done) {
            observable([1,2,3,4,5]);
            blockFactory.create(mockBlockConfig.config, editable, stage).then(function (block) {
                observable.push(block);
                expect(observable()[5]).toEqual(block);
                editable.onBlockSorted(event, {
                    block: block,
                    index: 2
                });
                expect(observable()[2]).toEqual(block);
                expect(observable()[5]).not.toEqual(block);
                done();
            });
        });
    });
});