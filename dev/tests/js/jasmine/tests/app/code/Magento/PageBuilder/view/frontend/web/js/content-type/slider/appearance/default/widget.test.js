/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/content-type/slider/appearance/default/widget',
    'Magento_PageBuilder/js/events',
    'jquery'
], function (sliderWidgetInitializer, uiEvents, $) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/slider/appearance/default/widget', function () {
        var el;

        beforeEach(function () {
            var childEl = document.createElement('div');

            el = document.createElement('div');
            el.setAttribute('data-display', true);

            childEl.setAttribute('data-content-type', 'slide');
            childEl.setAttribute('data-display', true);
            el.appendChild(childEl);
        });

        it('Should call unslick if element has class slick-initialized', function () {
            spyOn($.fn, 'slick');
            el.classList.add('slick-initialized');

            sliderWidgetInitializer(undefined, el);

            expect($.fn.slick).toHaveBeenCalledWith('unslick');
        });

        it('Should call slick on element based on its data', function () {
            spyOn($.fn, 'slick');

            el.setAttribute('data-autoplay', 'true');
            el.setAttribute('data-autoplay-speed', 500);
            el.setAttribute('data-fade', 'true');
            el.setAttribute('data-infinite-loop', 'true');
            el.setAttribute('data-show-arrows', 'true');
            el.setAttribute('data-show-dots', 'true');

            sliderWidgetInitializer(undefined, el);

            expect($.fn.slick).toHaveBeenCalledWith({
                autoplay: true,
                autoplaySpeed: 500,
                fade: true,
                infinite: true,
                arrows: true,
                dots: true
            });
        });

        it('Should bind to contentType:redrawAfter event', function () {
            spyOn(uiEvents, 'on');
            sliderWidgetInitializer(undefined, el);
            expect(uiEvents.on).toHaveBeenCalledWith('contentType:redrawAfter', jasmine.any(Function));
        });
    });
});
