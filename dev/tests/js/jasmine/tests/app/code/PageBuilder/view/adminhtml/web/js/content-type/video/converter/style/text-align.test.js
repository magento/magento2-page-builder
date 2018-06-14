/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'jquery',
    'Magento_PageBuilder/js/content-type/video/converter/style/text-align'
], function ($, Converter) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/video/converter/style/text-align', function () {
        var model;

        beforeEach(function () {
            model = new Converter();
        });

        describe('toDom', function () {
            it('Should pass through value when unknown', function () {
                var data = {
                    'text-align': 'foo'
                };

                expect(model.toDom('text-align', data)).toBe('foo');
            });
            it('Should convert known values', function () {
                var data = {
                    'text-align': 'left'
                };

                expect(model.toDom('text-align', data)).toBe('flex-start');
                data['text-align'] = 'center';
                expect(model.toDom('text-align', data)).toBe('center');
                data['text-align'] = 'right';
                expect(model.toDom('text-align', data)).toBe('flex-end');
            });
        });
        describe('fromDom', function () {
            it('Should convert known values', function () {
                expect(model.fromDom('flex-start')).toBe('left');
                expect(model.fromDom('center')).toBe('center');
                expect(model.fromDom('flex-end')).toBe('right');
            });
        });
    });
});
