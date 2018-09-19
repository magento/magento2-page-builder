/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'squire',
    'jquery'
], function (Squire, $) {
    'use strict';

    var mapWidgetInitializer,
        injector = new Squire(),
        mocks = {
            'Magento_PageBuilder/js/utils/map': jasmine.createSpy(),
            'googleMaps': jasmine.createSpy()
        },
        loadWidgetinitializer;

    /**
     * Load the widget initializer for map
     *
     * @param {Function} done
     */
    loadWidgetinitializer = function (done) {
        injector.mock(mocks);
        injector.require(
            ['Magento_PageBuilder/js/content-type/map/appearance/default/widget'],
            function (module) {
                mapWidgetInitializer = module;
                done();
            }
        );
    };

    describe('Magento_PageBuilder/js/content-type/map/appearance/default/widget', function () {
        beforeEach(loadWidgetinitializer);

        it('Does not call googleMap constructor if element is missing data-locations', function () {
            var el = $('div');

            mapWidgetInitializer(undefined, el);

            expect(mocks.googleMaps).not.toHaveBeenCalled();
        });

        it('Calls googleMap constructor if element has data-locations', function () {
            var el = $('<div />'),
                locationsJSON = '[{"position": {"latitude": 0, "longitude": 0}}]';

            el.attr('data-locations', locationsJSON);
            el.attr('data-show-controls', true);

            mapWidgetInitializer(undefined, el);

            expect(mocks['Magento_PageBuilder/js/utils/map']).toHaveBeenCalledWith(
                el[0],
                JSON.parse(locationsJSON),
                {
                    disableDefaultUI: false,
                    mapTypeControl: true
                }
            );
        });
    });
});
