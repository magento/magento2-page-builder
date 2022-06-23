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
        it('Should call "on" four times if both data attributes match config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" ' +
                        'data-content-type="thing" ' +
                        'data-show-overlay="1" ' +
                        'data-show-button="1">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'on');

            showOnHoverInitializerWidget(config);

            expect($.fn.on).toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
            expect($.fn.on).toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
            expect($.fn.on).toHaveBeenCalledTimes(4);
        });

        it('Should call "on" zero times if no data attributes match config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" ' +
                        'data-content-type="thing" ' +
                        'data-show-overlay="0" ' +
                        'data-show-button="0">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'on');

            showOnHoverInitializerWidget(config);

            expect($.fn.on).not.toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
            expect($.fn.on).not.toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
        });

        it('Should call "on" twice if only data-show-overlay matches config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" ' +
                        'data-content-type="thing" ' +
                        'data-show-overlay="1" ' +
                        'data-show-button="0">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'on');

            showOnHoverInitializerWidget(config);

            expect($.fn.on).toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
            expect($.fn.on).toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
            expect($.fn.on).toHaveBeenCalledTimes(2);
        });

        it('Should call "on" twice if only data-show-button matches config value', function () {
            var config = {
                dataRole: 'thing',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" ' +
                        'data-content-type="thing" ' +
                        'data-show-overlay="0" ' +
                        'data-show-button="1">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'on');

            showOnHoverInitializerWidget(config);

            expect($.fn.on).toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
            expect($.fn.on).toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
            expect($.fn.on).toHaveBeenCalledTimes(2);
        });

        it('Should call "on" zero times if data-content-type does not match config value', function () {
            var config = {
                dataRole: 'thing2',
                buttonSelector: '.button-selector',
                showOverlay: 1
            };

            el = $(
                '<div>' +
                    '<div class="button-selector" ' +
                        'data-content-type="thing" ' +
                        'data-show-overlay="1" ' +
                        'data-show-button="1">' +
                        '<a></a>' +
                    '</div>' +
                '</div>'
            );

            el.appendTo('body');

            spyOn($.fn, 'on');

            showOnHoverInitializerWidget(config);

            expect($.fn.on).not.toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
            expect($.fn.on).not.toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
        });
    });
});
