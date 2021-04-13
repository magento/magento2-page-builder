/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/utils/editor',
    'jquery'
], function (utils, $) {
    'use strict';

    describe('Magento_PageBuilder/js/utils/editor.js', function () {
        describe('lockImageSize', function () {
            it('Should not change the defined image sizes', function () {
                var image = new Image();

                $(document.body).append(image);
                $(image).width('100%');

                utils.lockImageSize(document.body);
                expect(image.style.width).toEqual('100%');

                image.remove();
            });
        });
    });
});
