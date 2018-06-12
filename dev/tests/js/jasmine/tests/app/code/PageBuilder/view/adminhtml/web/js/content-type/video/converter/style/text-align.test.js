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
                expect(model.toDom('foo')).toBe('foo');
            });
            it('Should convert known values', function () {
                expect(model.toDom('left')).toBe('flex-start');
                expect(model.toDom('center')).toBe('center');
                expect(model.toDom('right')).toBe('flext-end');
            });
        });
        describe('fromDom', function () {
            it('Should convert known values', function () {
                var data = {
                    'text-align': 'flex-start'
                };

                expect(model.fromDom('text-align', data)).toBe('left');
                data['text-align'] = 'center';
                expect(model.fromDom('text-align', data)).toBe('center');
                data['text-align'] = 'flex-end';
                expect(model.fromDom('text-align', data)).toBe('right');
            });
        });
    });
});
