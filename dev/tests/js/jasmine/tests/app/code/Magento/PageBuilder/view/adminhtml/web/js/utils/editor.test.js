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
                var image = document.createElement('img'),
                    element = document.createElement('div');

                image.setAttribute('width', '100%');
                $(element).append(image);

                utils.lockImageSize(element);
                expect(image.style.width).toEqual('100%');
            });
        });

        describe('unlockImageSize', function () {
            it('Should unlock locked images sizes only', function () {
                var image = document.createElement('img'),
                    element = document.createElement('div');

                $(image).css({'width' : '100%', 'height' : '100%'});
                $(image).attr('data-height-locked', 'true');
                $(element).append(image);

                utils.unlockImageSize(element);
                expect(image.style.width).toEqual('100%');
                expect(image.style.height).toEqual('');
            });
        });
    });
});
