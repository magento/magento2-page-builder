/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
define([
    'jquery',
    'Magento_PageBuilder/js/converter/html/products-directive',
    'prototype'
], function ($, ProductsDirective) {
    'use strict';

    describe('Magento_PageBuilder/js/converter/html/products-directive', function () {
        var model;

        beforeEach(function () {
            model = new ProductsDirective();
        });

        describe('toDom', function () {
            it('Should return an empty string when conditions_encoded is null', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: null
                    },
                    result = model.toDom('n/a', data);

                expect(result).toBe('');
            });
            it('Should return an empty string when conditions_encoded is false', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: false
                    },
                    result = model.toDom('n/a', data);

                expect(result).toBe('');
            });
            it('Should return an empty string when conditions_encoded is empty string', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: ''
                    },
                    result = model.toDom('n/a', data);

                expect(result).toBe('');
            });
            it('Should return an empty string when conditions_encoded is empty undefined', function () {
                var data = {
                        products_count: 123
                    },
                    result = model.toDom('n/a', data);

                expect(result).toBe('');
            });
            it('Should transform regular properties', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: '[]'
                    },
                    result = model.toDom('n/a', data);

                expect(result).toMatch(/^\{\{widget\s.*\}\}$/);
                expect(result).toContain(' products_count="123"');
                expect(result).toContain(' conditions_encoded="[]"');
                expect(result).toContain(' type="Magento\\CatalogWidget\\Block\\Product\\ProductsList"');
                expect(result).toContain(' template="Magento_CatalogWidget::product/widget/content/grid.phtml"');
                expect(result).toContain(' anchor_text=""');
                expect(result).toContain(' id_path=""');
                expect(result).toContain(' show_pager="0"');
                expect(result).toContain(' type_name="Catalog Products List"');
            });
            it('Should encode conditions_encoded', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: '{"1":{"type":"My\\\\Type","aggregator":"all"}}'
                    },
                    result = model.toDom('n/a', data),
                    matchText = '^[`1`:^[`type`:`My||Type`,`aggregator`:`all`^]^]';

                expect(result).toContain(' conditions_encoded="' + matchText + '"');
                expect(result).toContain(' type="Magento\\CatalogWidget\\Block\\Product\\ProductsList"');
                expect(result).toContain(' template="Magento_CatalogWidget::product/widget/content/grid.phtml"');
                expect(result).toContain(' anchor_text=""');
                expect(result).toContain(' id_path=""');
                expect(result).toContain(' show_pager="0"');
                expect(result).toContain(' type_name="Catalog Products List"');
            });
        });
        describe('fromDom', function () {
            it('Should parse regular properties without conditions_encoded', function () {
                var expected = {
                        products_count: '123',
                        conditions_encoded: ''
                    },
                    input = '{{widget products_count="123"}}',
                    result = model.fromDom(input);

                expect(result.products_count).toBe(expected.products_count);
                expect(result.conditions_encoded).toBe(expected.conditions_encoded);
            });
            it('Should parse conditions_encoded', function () {
                var expected = {
                        products_count: '123',
                        conditions_encoded: '{"1":{"type":"My\\\\Type","aggregator":"all"}}'
                    },
                    input = '{{widget ' +
                        'products_count="123" ' +
                        'conditions_encoded="^[`1`:^[`type`:`My||Type`,`aggregator`:`all`^]^]"}}',
                    result = model.fromDom(input);

                expect(result.products_count).toBe(expected.products_count);
                expect(result.conditions_encoded).toBe(expected.conditions_encoded);
            });
        });
    });
});
