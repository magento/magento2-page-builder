/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
define([
    'jquery',
    'Magento_PageBuilder/js/content-type/products/mass-converter/widget-directive'
], function ($, WidgetDirective) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/products/mass-converter/widget-directive', function () {
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
                        products_count: 123,
                        conditions_encoded: '[]'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toMatch(/^\{\{widget\s.*\}\}$/);
                expect(result.myhtml).toContain(' products_count="123"');
                expect(result.myhtml).toContain(' conditions_encoded="[]"');
                expect(result.myhtml).toContain(' type="Magento\\CatalogWidget\\Block\\Product\\ProductsList"');
                expect(result.myhtml).toContain(' template="Magento_CatalogWidget::product/widget/content/grid.phtml"');
                expect(result.myhtml).toContain(' anchor_text=""');
                expect(result.myhtml).toContain(' id_path=""');
                expect(result.myhtml).toContain(' show_pager="0"');
                expect(result.myhtml).toContain(' type_name="Catalog Products List"');
            });
            it('Should encode conditions_encoded', function () {
                var data = {
                        products_count: 123,
                        conditions_encoded: '{"1":{"type":"My\\\\Type","aggregator":"all"}}'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config),
                    matchText = '^[`1`:^[`type`:`My||Type`,`aggregator`:`all`^]^]';

                expect(result.myhtml).toContain(' conditions_encoded="' + matchText + '"');
                expect(result.myhtml).toContain(' type="Magento\\CatalogWidget\\Block\\Product\\ProductsList"');
                expect(result.myhtml).toContain(' template="Magento_CatalogWidget::product/widget/content/grid.phtml"');
                expect(result.myhtml).toContain(' anchor_text=""');
                expect(result.myhtml).toContain(' id_path=""');
                expect(result.myhtml).toContain(' show_pager="0"');
                expect(result.myhtml).toContain(' type_name="Catalog Products List"');
            });
        });
        describe('fromDom', function () {
            it('Should parse regular properties without conditions_encoded', function () {
                var expected = {
                        products_count: '123',
                        conditions_encoded: ''
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    attributes = {
                        myhtml: '{{widget products_count="123"}}'
                    },
                    result = model.fromDom(attributes, config);

                expect(result.products_count).toBe(expected.products_count);
                expect(result.conditions_encoded).toBe(expected.conditions_encoded);
                // assert the automatically added properties do not get returned.
                expect(result.type).toBe(undefined);
                expect(result.id_path).toBe(undefined);
            });
            it('Should parse conditions_encoded', function () {
                var expected = {
                        products_count: '123',
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

                expect(result.products_count).toBe(expected.products_count);
                expect(result.conditions_encoded).toBe(expected.conditions_encoded);
                // assert the automatically added properties do not get returned.
                expect(result.type).toBe(undefined);
                expect(result.id_path).toBe(undefined);
            });
        });
    });
});
