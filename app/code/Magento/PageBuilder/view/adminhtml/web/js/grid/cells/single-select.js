/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_Ui/js/grid/columns/multiselect',
    'underscore'
], function (Select, _) {
    'use strict';

    return Select.extend({
        defaults: {
            headerTmpl: 'ui/grid/columns/text',
            bodyTmpl: 'Magento_PageBuilder/grid/cells/single-select',
            label: '',
            extendedSelections: [],
            lastSelected: null,
            listens: {
                selected: 'onSelectedChange setExtendedSelections'
            }
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super()
                .observe('extendedSelections lastSelected');

            return this;
        },

        /**
         * Getter for extended selections.
         *
         * @returns {Array}
         */
        getExtendedSelections: function () {
            return this.extendedSelections();
        },

        /**
         * Setter for extended selections.
         *
         * @param {Array} selected
         */
        setExtendedSelections: function (selected) {
            var item = {},
                extended = [];

            _.each(selected, function (id) {
                item[this.indexField] = id;
                extended.push(_.findWhere(this.rows(), item));
            }, this);

            this.set('extendedSelections', extended);
        },

        /** @inheritdoc */
        isSelected: function (id, isIndex) {
            id = this.getId(id, isIndex);

            return this.selected()[0] === id;
        },

        /** @inheritdoc **/
        select: function (id) {
            this._super();
            this.lastSelected(id);

            return this;
        },

        /** @inheritdoc */
        _setSelection: function (id, isIndex, select) {
            var selected = this.selected;

            id = this.getId(id, isIndex);

            if (!select && this.isSelected(id)) {
                selected([]);
            } else if (select) {
                selected([id]);
            }

            return this;
        }
    });
});
