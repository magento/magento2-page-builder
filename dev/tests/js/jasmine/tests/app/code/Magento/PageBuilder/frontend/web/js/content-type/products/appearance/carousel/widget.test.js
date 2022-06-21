/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/content-type/products/appearance/carousel/widget',
    'jquery'
], function (sliderWidgetInitializer, $) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/products/appearance/carousel/widget', function () {
        var config = {
                breakpoints: {
                    desktop: {
                        conditions: {
                            'min-width': '1px'
                        },
                        options: {
                            products: {
                                default: {
                                    slidesToShow: 5
                                }
                            }
                        }
                    }
                }
            },
            el;

        beforeEach(function () {
            var childEl = document.createElement('div');

            el = document.createElement('div');
            el.setAttribute('data-display', true);
            el.appendChild(childEl);
        });

        it('Should call unslick if element has class slick-initialized', function () {
            spyOn($.fn, 'slick');
            el.children[0].classList.add('slick-initialized');

            sliderWidgetInitializer(config, el);

            expect($.fn.slick).toHaveBeenCalledWith('unslick');
        });

        it('Should call slick on element based on its data', function () {
            spyOn($.fn, 'slick');

            el.setAttribute('data-autoplay', 'false');
            el.setAttribute('data-autoplay-speed', 4000);
            el.setAttribute('data-infinite-loop', 'false');
            el.setAttribute('data-show-arrows', 'false');
            el.setAttribute('data-show-dots', 'true');
            el.setAttribute('data-carousel-mode', 'default');

            sliderWidgetInitializer(config, el);

            expect($.fn.slick).toHaveBeenCalledWith({
                autoplay: false,
                autoplaySpeed: 4000,
                arrows: false,
                dots: true,
                infinite: false,
                slidesToShow: 5,
                slidesToScroll: 5
            });
        });
    });
});
