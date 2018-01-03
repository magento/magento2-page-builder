/**
 * Extend the core ui-select field.
 * Force it to be an "optgroup" field and override the filteroptionslist action to make an ajax call
 * to retrieve our data.
 *
 */
define([
    'underscore',
    'Magento_Ui/js/form/element/ui-select',
    'mage/translate',
    'jquery'
], function (_, Field, $t, $) {
    'use strict';

    return Field.extend({
        ajaxRequest: null,

        defaults: {
            loaderVisible: false,
            filterOptions: true,
            selectType: 'optgroup',
            disableLabel: true,
            multiple: false,
            selectedPlaceholders: {
                defaultPlaceholder: $t('Search...')
            }
        },

        initObservable: function () {
            this._super();
            this.observe([
                'loaderVisible'
            ]);

            return this;
        },

        setInitialValue: function () {
            this._super();

            if (this.initialValue > 0) {
                this.loaderVisible(true);
                this.ajaxRequest = $.ajax({
                    url: this.ajaxEndpoint + "id/" + this.initialValue,
                    type: 'POST',
                    data: {form_key: window.FORM_KEY}
                }).done(function(data) {
                    if (!data.length) {
                        return;
                    }

                    this.options(data);
                    this.cacheOptions.plain = data;
                    this._setItemsQuantity(data.length);
                    this.cleanHoveredElement();
                    this.loaderVisible(false);
                    this.ajaxRequest = null;
                    this.toggleOptionSelected(data[0]);
                    this.setCaption();

                }.bind(this));
            }

            return this;
        },

        filterOptionsList: function () {
            var value = this.filterInputValue().trim().toLowerCase();

            if (value === '' || value.length <= 2) {
                this.renderPath = false;
                this.options([]);
                this._setItemsQuantity(false);
                this.cleanHoveredElement();
                return false;
            }

            if (this.ajaxRequest) {
                this.ajaxRequest.abort();
            }

            this.loaderVisible(true);
            this.ajaxRequest = $.ajax({
                url: this.ajaxEndpoint + "term/" + value,
                type: 'POST',
                data: {form_key: window.FORM_KEY}
            }).done(function(data) {
                if (!data.length) {
                    this.options([]);
                    this._setItemsQuantity(0);
                } else {
                    this.cacheOptions.plain = [];

                    this.options(data);
                    this._setItemsQuantity(data.length);
                }
                this.cleanHoveredElement();

                this.loaderVisible(false);
                this.ajaxRequest = null;
            }.bind(this));
        }
    });
});