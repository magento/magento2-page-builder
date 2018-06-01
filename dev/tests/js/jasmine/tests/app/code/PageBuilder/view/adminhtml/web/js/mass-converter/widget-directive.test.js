/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
define([
    'jquery',
    'Magento_PageBuilder/js/mass-converter/widget-directive'
], function ($, WidgetDirective) {
    'use strict';

    describe('Magento_PageBuilder/js/mass-converter/widget-directive', function () {
        var model;

        beforeEach(function () {
            model = new WidgetDirective();
        });

        describe('toDom', function () {
            it('Should transform properties', function () {
                var data = {
                        abc: 123,
                        cba: '[]'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toMatch(/^\{\{widget\s.*\}\}$/);
                expect(result.myhtml).toContain(' abc="123"');
                expect(result.myhtml).toContain(' cba="[]"');
            });
        });
        describe('fromDom', function () {
            it('Should parse properties', function () {
                var expected = {
                        abc: '123',
                        cba: 'foobar'
                    },
                    atrributes = {
                        myhtml: '{{widget abc="123" cba="foobar"}}'
                    },
                    config = {
                        html_variable: 'myhtml'
                    }
                    result = model.fromDom(atrributes, config);

                expect(result.abc).toBe(expected.abc);
                expect(result.cba).toBe(expected.cba);
            });
        });
    });
});
