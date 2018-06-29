/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
define([
    'jquery',
    'Magento_PageBuilder/js/content-type/block/mass-converter/widget-directive'
], function ($, WidgetDirective) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/block/mass-converter/widget-directive', function () {
        var model;

        beforeEach(function () {
            model = new WidgetDirective();
        });

        describe('toDom', function () {
            it('Should leave html undefined when template is undefined', function () {
                var data = {
                        block_id: 123
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toBe(undefined);
            });
            it('Should leave html undefined when block_id is undefined', function () {
                var data = {
                        template: 'foobar'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toBe(undefined);
            });
            it('Should transform html when template and block_id are set', function () {
                var data = {
                        template: 'foobar',
                        block_id: 123
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    result = model.toDom(data, config);

                expect(result.myhtml).toMatch(/^\{\{widget\s.*\}\}$/);
                expect(result.myhtml).toContain(' template="foobar"');
                expect(result.myhtml).toContain(' block_id="123"');
                expect(result.myhtml).toContain(' type="Magento\\Cms\\Block\\Widget\\Block"');
                expect(result.myhtml).toContain(' type_name="CMS Static Block"');
            });
        });
        describe('fromDom', function () {
            it('Should parse regular properties', function () {
                var expected = {
                        template: 'foobar',
                        block_id: '123'
                    },
                    config = {
                        html_variable: 'myhtml'
                    },
                    attributes = {
                        myhtml: '{{widget template="foobar" block_id="123" type_name="CMS Static Block" ' +
                            'type="Magento\\Cms\\Block\\Widget\\Block"}}'
                    },
                    result = model.fromDom(attributes, config);

                expect(result.template).toBe(expected.template);
                expect(result.block_id).toBe(expected.block_id);
                // assert the automatically added properties do not get returned.
                expect(result.type).toBe(undefined);
                expect(result.type_name).toBe(undefined);
            });
        });
    });
});
