/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/widget/bind-click-to-data-link-element',
    'jquery'
], function (bindClickToLinkInitializerWidget, $) {
    'use strict';

    var $el,
        originalRedirectTo = bindClickToLinkInitializerWidget.redirectTo;

    afterEach(function () {
        if ($el !== undefined) {
            $el.remove();
        }
    });

    describe('Magento_PageBuilder/js/widget/bind-click-to-data-link-element', function () {
        it('Should not navigate away from page if it is missing href attribute', function () {
            spyOn(bindClickToLinkInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" href="" target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            bindClickToLinkInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(bindClickToLinkInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should not navigate away from page if href is javascript:void(0)', function () {
            spyOn(bindClickToLinkInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" href="javascript:void(0)" target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            bindClickToLinkInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(bindClickToLinkInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should not navigate away from page if it is missing data-link-type attribute', function () {
            spyOn(bindClickToLinkInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div href="https://adobe.com" target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            bindClickToLinkInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(bindClickToLinkInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should not navigate to an simulated anchor\'s href if clicked inside of nested anchor', function () {
            spyOn(bindClickToLinkInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" href="https://adobe.com" target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            bindClickToLinkInitializerWidget(null, $el);

            $el.find('.inner-anchor').click();

            expect(bindClickToLinkInitializerWidget.redirectTo).not.toHaveBeenCalled();
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should navigate to an simulated anchor\'s href if clicked outside of nested anchor', function () {
            spyOn(bindClickToLinkInitializerWidget, 'redirectTo');
            spyOn(window, 'open');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" href="https://adobe.com" target>' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            bindClickToLinkInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(bindClickToLinkInitializerWidget.redirectTo).toHaveBeenCalledWith('https://adobe.com', '');

            originalRedirectTo('https://adobe.com', '');
            expect(window.open).not.toHaveBeenCalled();
        });

        it('Should call window.open if target is _blank', function () {
            spyOn(window, 'open');
            spyOn(bindClickToLinkInitializerWidget, 'redirectTo');

            $el = $(
                '<div data-role="content-type">' +
                    '<div data-link-type="link" href="https://adobe.com" target="_blank">' +
                        '<span class="span-outside-inner-anchor">Hello world</span>' +
                        '<a class="inner-anchor" href="https://something.com"><span>Something</span></a>' +
                    '</div>' +
                '</div>'
            );

            $el.appendTo('body');

            bindClickToLinkInitializerWidget(null, $el);

            $el.find('.span-outside-inner-anchor').click();

            expect(bindClickToLinkInitializerWidget.redirectTo).toHaveBeenCalledWith('https://adobe.com', '_blank');

            originalRedirectTo('https://adobe.com', '_blank');
            expect(window.open).toHaveBeenCalledWith('https://adobe.com', '_blank');
        });
    });
});
