/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'squire'
], function (Squire) {
    'use strict';

    var mapWidgetInitializer,
        injector = new Squire(),
        mocks = {
            'Magento_PageBuilder/js/utils/map': jasmine.createSpy(),
            'googleMaps': jasmine.createSpy()
        };

    beforeEach(function (done) {
        injector.mock(mocks);
        injector.require(['Magento_PageBuilder/js/content-type/map/appearance/default/widget'], function (module) {
            mapWidgetInitializer = module;
            done();
        });
    });

    describe('Magento_PageBuilder/js/content-type/map/appearance/default/widget', function () {

        it('Does not call googleMap constructor if element is missing data-locations', function () {
            var el = document.createElement('div');

            mapWidgetInitializer(undefined, el);

            expect(mocks.googleMaps).not.toHaveBeenCalled();
        });

        it('Calls googleMap constructor if element has data-locations', function () {
            var el = document.createElement('div'),
                locationsJSON = '[{"position": {"latitude": 0, "longitude": 0}}]';

            el.setAttribute('data-locations', locationsJSON);
            el.setAttribute('data-show-controls', true);

            mapWidgetInitializer(undefined, el);

            expect(mocks['Magento_PageBuilder/js/utils/map']).toHaveBeenCalledWith(
                el,
                JSON.parse(locationsJSON),
                {
                    disableDefaultUI: false,
                    mapTypeControl: true
                }
            );
        });
    });
});
