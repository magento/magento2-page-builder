/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/widget/click-event-binder',
    'jquery'
], function (clickEventBinderInitializerWidget, $) {
    'use strict';

    var $el,
        originalRedirectTo = clickEventBinderInitializerWidget.redirectTo;

    afterEach(function () {
        if ($el !== undefined) {
            $el.remove();
        }
    });

    describe('Magento_PageBuilder/js/widget/click-event-binder', function () {
        it('Should not navigate away from page if it is missing href attribute', function () {
            spyOn(clickEventBinderInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" data-href="" data-target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" data-href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            clickEventBinderInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(clickEventBinderInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should not navigate away from page if href is javascript:void(0)', function () {
            spyOn(clickEventBinderInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" data-href="javascript:void(0)" data-target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            clickEventBinderInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(clickEventBinderInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should not navigate away from page if it is missing data-link-type attribute', function () {
            spyOn(clickEventBinderInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-href="https://adobe.com" data-target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            clickEventBinderInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(clickEventBinderInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should not navigate to simulated anchor\'s href if clicked inside of nested anchor', function () {
            spyOn(clickEventBinderInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" data-href="https://adobe.com" data-target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            clickEventBinderInitializerWidget(null, $el);

            $el.find('.inner-anchor').click();

            expect(clickEventBinderInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should navigate to simulated anchor\'s href if clicked outside of nested anchor', function () {
            spyOn(clickEventBinderInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" data-href="https://adobe.com" data-target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            clickEventBinderInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(clickEventBinderInitializerWidget.redirectTo).toHaveBeenCalledWith('https://adobe.com', '');

            originalRedirectTo('https://adobe.com', '');
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should call window.open if data-target is _blank', function () {
            spyOn(window, 'open');
            spyOn(clickEventBinderInitializerWidget, 'redirectTo');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" data-href="https://adobe.com" data-target="_blank">' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            clickEventBinderInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(clickEventBinderInitializerWidget.redirectTo).toHaveBeenCalledWith('https://adobe.com', '_blank');

            originalRedirectTo('https://adobe.com', '_blank');
            expect(window.open).toHaveBeenCalledWith('https://adobe.com', '_blank');
        });
    });
});
