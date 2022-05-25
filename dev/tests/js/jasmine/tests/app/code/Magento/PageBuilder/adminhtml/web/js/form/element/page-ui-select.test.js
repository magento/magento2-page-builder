/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'jquery',
    'Magento_PageBuilder/js/form/element/page-ui-select',
    'ko'
], function ($, PageUiSelect, ko) {
    'use strict';

    describe('Magento_PageBuilder/js/form/element/page-ui-select', function () {
        var model;

        beforeEach(function () {
            model = new PageUiSelect({
                name: 'uiSelect',
                dataScope: '',
                provider: 'provider'
            });

            model.value = ko.observableArray([]);
            model.cacheOptions.plain = [];
        });

        describe('"getPath" method', function () {
            it('Should return identifier value', function () {
                var data = {
                    value: 10,
                    label: 'My Option Label',
                    identifier: 'ID: 30'
                };

                model.filterInputValue('hello');
                model.filterOptionsList();
                expect(model.getPath(data)).toBe(data.identifier);
            });

            it('Should return empty string when identifier is not passed', function () {
                var data = {
                    value: 10,
                    label: 'My Option Label'
                };

                model.filterInputValue('hello');
                model.filterOptionsList();
                expect(model.getPath(data)).toBe('');
            });

            it('Should return empty string when renderPath is false', function () {
                var data = {
                    value: 10,
                    label: 'My Option Label'
                };

                expect(model.getPath(data)).toBe('');
            });
        });
    });
});
