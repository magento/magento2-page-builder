/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for stage/component/block/factory.js
 *
 */
define([
    'ko',
    'bluefoot/block/factory'
], function (ko, BlockFactory) {
    describe("Gene_BlueFoot/js/component/stage/component/block/factory", function () {
        var stage, mockBlockConfig,
            blockFactory = new BlockFactory();
        beforeEach(function () {
            stage = {
                save: {
                    observe: function () {},
                    update: function () {}
                }
            };
            mockBlockConfig = {
                editOnInsert: false,
                code: 'testBlock'
            };
        });

        it("can create new instance of block from config", function (done) {
            blockFactory.create(mockBlockConfig, stage, stage).then(function (block) {
                expect(block.config.code).toEqual('testBlock');
                done();
            });
        });

    });
});