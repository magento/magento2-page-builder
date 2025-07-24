/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 */
define([
    'Magento_PageBuilder/js/content-type/tabs/appearance/default/widget',
    'jquery'
], function (tabsInitializerWidget, $) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/content-type/tabs/appearance/default/widget', function () {
        it('Should call $.ui.tabs with active based on element\'s activeTab data', function () {
            var el = document.createElement('div');

            spyOn($.ui, 'tabs');

            el.setAttribute('data-active-tab', 1);

            tabsInitializerWidget(undefined, el);

            expect($.ui.tabs).toHaveBeenCalledWith({
                active: 1,
                create: jasmine.any(Function),
                activate: jasmine.any(Function)
            }, el);
        });

        it('Should call $.ui.tabs with inactive state if missing element\'s activeTab data', function () {
            var el = document.createElement('div');

            spyOn($.ui, 'tabs');

            tabsInitializerWidget(undefined, el);

            expect($.ui.tabs).toHaveBeenCalledWith({
                active: 0,
                create: jasmine.any(Function),
                activate: jasmine.any(Function)
            }, el);
        });
    });
});
