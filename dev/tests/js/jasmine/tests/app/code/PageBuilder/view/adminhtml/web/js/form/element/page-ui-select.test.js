/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_PageBuilder/js/form/element/page-ui-select',
    'ko'
], function ($, PageUiSelect, ko) {
    'use strict';

    describe('Magento_Backend/js/validate-store', function () {
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

        it('check getPath method if id was specified', function () {
            var data = {
                value: 10,
                label: 'My Option Label',
                identifier: 'ID: 30'
            };

            model.filterInputValue('hello');
            model.filterOptionsList();
            expect(model.getPath(data)).toBe(data.identifier);
        });

        it('check getPath method if id not specified specified', function () {
            var data = {
                value: 10,
                label: 'My Option Label'
            };

            model.filterInputValue('hello');
            model.filterOptionsList();
            expect(model.getPath(data)).toBe('');
        });

        it('check getPath method if id not specified specified', function () {
            var data = {
                value: 10,
                label: 'My Option Label'
            };

            model.filterInputValue('hello');
            model.filterOptionsList();
            expect(model.getPath(data)).toBe('');
        });
    });
});
