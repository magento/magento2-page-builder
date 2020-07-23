/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
define([
    'jquery',
    'Magento_PageBuilder/js/content-type/products/mass-converter/carousel-widget-directive'
], function ($, WidgetDirective) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/products/mass-converter/carousel-widget-directive', function () {
        var model;

        beforeEach(function () {
            model = new WidgetDirective();
        });

        describe('toDom', function () {
            it('Should return an empty string when conditions_encoded is null', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: null
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toBe(undefined);
            });
            it('Should return an empty string when conditions_encoded is false', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: false
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toBe(undefined);
            });
            it('Should return an empty string when conditions_encoded is empty string', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: ''
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toBe(undefined);
            });
            it('Should return an empty string when conditions_encoded is empty undefined', function () {
                var data = {
                        products_count: 123
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toBe(undefined);
            });
            it('Should transform regular properties', function () {
                var data = {
                        carousel_products_count: 123,
                        conditions_encoded: '[]',
                        condition_option: 'condition',
                        sort_order: 'position'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toMatch(/^\{\{widget\s.*\}\}$/);
                expect(result.myhtml).toContain(' products_count="123"');
                expect(result.myhtml).toContain(' conditions_encoded="[]"');
                expect(result.myhtml).toContain(' type="Magento\\CatalogWidget\\Block\\Product\\ProductsList"');
                expect(result.myhtml)
                    .toContain(' template="Magento_PageBuilder::catalog/product/widget/content/carousel.phtml"');
                expect(result.myhtml).toContain(' anchor_text=""');
                expect(result.myhtml).toContain(' id_path=""');
                expect(result.myhtml).toContain(' show_pager="0"');
                expect(result.myhtml).toContain(' type_name="Catalog Products Carousel"');
                expect(result.myhtml).toContain(' condition_option="condition');
                expect(result.myhtml).toContain(' sort_order="position');
                expect(result.myhtml).toContain(' condition_option_value=""');
            });
            it('Should encode conditions_encoded', function () {
                var data = {
                        carousel_products_count: 123,
                        conditions_encoded: '{"1":{"type":"My\\\\Type","aggregator":"all"}}'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config),
                    matchText = '^[`1`:^[`type`:`My||Type`,`aggregator`:`all`^]^]';

                expect(result.myhtml).toContain(' conditions_encoded="' + matchText + '"');
                expect(result.myhtml).toContain(' type="Magento\\CatalogWidget\\Block\\Product\\ProductsList"');
                expect(result.myhtml)
                    .toContain(' template="Magento_PageBuilder::catalog/product/widget/content/carousel.phtml"');
                expect(result.myhtml).toContain(' anchor_text=""');
                expect(result.myhtml).toContain(' id_path=""');
                expect(result.myhtml).toContain(' show_pager="0"');
                expect(result.myhtml).toContain(' type_name="Catalog Products Carousel"');
            });
            it('Should not add empty sort_order attribute', function () {
                var data = {
                        carousel_products_count: 123,
                        conditions_encoded: '[]'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).not.toContain('sort_order');
            });
        });
        describe('fromDom', function () {
            it('Should parse regular properties without conditions_encoded', function () {
                var expected = {
                        carousel_products_count: '123',
                        conditions_encoded: '',
                        condition_option: 'condition'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    attributes = {
                        myhtml: '{{widget products_count="123"}}'
                    },
                    result = model.fromDom(attributes, config);

                expect(result.carousel_products_count).toBe(expected.carousel_products_count);
                expect(result.conditions_encoded).toBe(expected.conditions_encoded);
                expect(result.condition_option).toBe(expected.condition_option);
                // assert the automatically added properties do not get returned.
                expect(result.type).toBe(undefined);
                expect(result.id_path).toBe(undefined);
            });
            it('Should parse conditions_encoded', function () {
                var expected = {
                        carousel_products_count: '123',
                        conditions_encoded: '{"1":{"type":"My\\\\Type","aggregator":"all"}}'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    attributes = {
                        myhtml: '{{widget ' +
                            'products_count="123" ' +
                            'conditions_encoded="^[`1`:^[`type`:`My||Type`,`aggregator`:`all`^]^]"}}'
                    },
                    result = model.fromDom(attributes, config);

                expect(result.carousel_products_count).toBe(expected.carousel_products_count);
                expect(result.conditions_encoded).toBe(expected.conditions_encoded);
                // assert the automatically added properties do not get returned.
                expect(result.type).toBe(undefined);
                expect(result.id_path).toBe(undefined);
            });
        });
    });
});
