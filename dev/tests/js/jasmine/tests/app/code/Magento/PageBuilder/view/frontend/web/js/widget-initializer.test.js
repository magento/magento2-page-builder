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
        };

    beforeEach(function (done) {
        injector.mock(mocks);
        injector.require(['Magento_PageBuilder/js/widget-initializer'], function (module) {
            widgetInitializer = module;
            done();
        });
    });

    afterEach(function () {
        if (el !== undefined) {
            el.remove();
        }
    });

    describe('Magento_PageBuilder/js/content-type/map/appearance/default/widget', function () {
        it('Calls mage.applyFor on each element with each item present in config', function () {
            var data;

            el = $('<div class="unique-element-class-attr"></div>');

            el.appendTo('body');

            data = {
                config: {
                    '.unique-element-class-attr': {
                        awesome: true,
                        cool: true
                    }
                }
            };

            widgetInitializer(data, el);

            expect(mocks['mage/apply/main'].applyFor).toHaveBeenCalledWith(el[0], true, 'awesome');
            expect(mocks['mage/apply/main'].applyFor).toHaveBeenCalledWith(el[0], true, 'cool');
        });
    });
});
