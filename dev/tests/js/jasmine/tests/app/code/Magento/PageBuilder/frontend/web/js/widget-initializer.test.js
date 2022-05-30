/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'squire',
    'jquery'
], function (Squire, $) {
    'use strict';

    var widgetInitializer,
        injector = new Squire(),
        el,
        mocks = {
            'mage/apply/main': {
                applyFor: jasmine.createSpy()
            }
        },
        loadWidgetInitializer,
        removeCreatedElement;

    /**
     * Load the widget initializer for the tests
     *
     * @param {Function} done
     */
    loadWidgetInitializer = function (done) {
        injector.mock(mocks);
        injector.require(['Magento_PageBuilder/js/widget-initializer'], function (module) {
            widgetInitializer = module;
            done();
        });
    };

    /**
     * Remove any created elements
     */
    removeCreatedElement = function () {
        if (el !== undefined) {
            el.remove();
        }
    };

    describe('Magento_PageBuilder/js/content-type/map/appearance/default/widget', function () {
        beforeEach(loadWidgetInitializer);
        afterEach(removeCreatedElement);

        it('Calls mage.applyFor on each element with each item present in config', function () {
            var data,
                applyForMock;

            el = $('<div class="unique-element-class-attr"></div>');

            el.appendTo('body');

            data = {
                config: {
                    '.unique-element-class-attr': {
                        awesome: false,
                        cool: {}
                    }
                },
                breakpoints: {},
                currentViewport: {}
            };

            widgetInitializer(data);

            applyForMock = mocks['mage/apply/main'].applyFor;
            expect(applyForMock).toHaveBeenCalledWith(jasmine.any(Object), {
                breakpoints: {},
                currentViewport: {}
            }, 'awesome');
            expect(applyForMock).toHaveBeenCalledWith(jasmine.any(Object), {
                breakpoints: {},
                currentViewport: {}
            }, 'cool');
            // Due to jQuery objects not being === we must use jQuery's is to validate if the elements are the same
            expect(el.is(applyForMock.calls.mostRecent().args[0])).toBeTruthy();
        });
    });
});
