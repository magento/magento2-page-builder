/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/widget/show-on-hover',
    'jquery'
], function (showOnHoverInitializerWidget, $) {
    'use strict';

    var el;

    afterEach(function () {
        if (el !== undefined) {
            el.remove();
        }
    });

    describe('Magento_PageBuilder/js/widget/show-on-hover', function () {
        it('Should call hover twice if both data attributes match config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" data-content-type="thing" data-show-overlay="1" data-show-button="1">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'hover');

            showOnHoverInitializerWidget(config);

            expect($.fn.hover).toHaveBeenCalledTimes(2);
        });

        it('Should call hover zero times if no data attributes match config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" data-content-type="thing" data-show-overlay="0" data-show-button="0">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'hover');

            showOnHoverInitializerWidget(config);

            expect($.fn.hover).not.toHaveBeenCalled();
        });

        it('Should call hover one time if only data-show-overlay matches config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" data-content-type="thing" data-show-overlay="1" data-show-button="0">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'hover');

            showOnHoverInitializerWidget(config);

            expect($.fn.hover).toHaveBeenCalledTimes(1);
        });

        it('Should call hover one time if only data-show-button matches config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" data-content-type="thing" data-show-overlay="0" data-show-button="1">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'hover');

            showOnHoverInitializerWidget(config);

            expect($.fn.hover).toHaveBeenCalledTimes(1);
        });

        it('Should call hover zero times if data-content-type does not match config value', function () {
            var config = {
                dataRole: 'thing2',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" data-content-type="thing" data-show-overlay="1" data-show-button="1">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'hover');

            showOnHoverInitializerWidget(config);

            expect($.fn.hover).not.toHaveBeenCalled();
        });
    });
});
