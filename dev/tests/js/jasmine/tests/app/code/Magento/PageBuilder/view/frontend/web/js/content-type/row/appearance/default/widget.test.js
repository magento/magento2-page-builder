/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/content-type/row/appearance/default/widget'
], function (rowWidgetInitializer) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/row/appearance/default/widget', function () {
        it('Should not call jarallax if enableParallax !== 1', function () {
            var el = document.createElement('div');

            spyOn(window, 'jarallax');

            el.setAttribute('data-enable-parallax', 0);

            rowWidgetInitializer(undefined, el);

            expect(window.jarallax).not.toHaveBeenCalled();
        });

        it('Should call jarallax if enableParallax === 1', function () {
            var el = document.createElement('div');

            spyOn(window, 'jarallax');

            el.setAttribute('data-enable-parallax', 1);

            rowWidgetInitializer(undefined, el);

            expect(window.jarallax).toHaveBeenCalled();
        });

        it('Should call jarallax on element based on its data', function () {
            var el = document.createElement('div');

            spyOn(window, 'jarallax');

            el.setAttribute('data-enable-parallax', 1);

            el.style.backgroundPosition = '0px 50%';
            el.style.backgroundRepeat = 'repeat';
            el.style.backgroundSize = '100%';
            el.setAttribute('data-parallax-speed', 1);

            document.body.appendChild(el);
            rowWidgetInitializer(undefined, el);

            expect(window.jarallax).toHaveBeenCalledWith(el, {
                imgPosition: '0px 50%',
                imgRepeat: 'repeat',
                imgSize: '100%',
                speed: 1
            });
            document.body.removeChild(el);
        });
    });
});
