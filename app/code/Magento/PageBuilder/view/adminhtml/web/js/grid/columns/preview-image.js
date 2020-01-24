/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'Magento_Ui/js/grid/columns/column',
    'jquery',
    'mage/template',
    'text!Magento_PageBuilder/template/grid/cells/preview-image/preview.html',
    'underscore',
    'Magento_Ui/js/modal/modal',
    'mage/translate'
], function (Column, $, mageTemplate, thumbnailPreviewTemplate, _) {
    'use strict';

    return Column.extend({
        defaults: {
            bodyTmpl: 'ui/grid/cells/thumbnail',
            fieldClass: {
                'data-grid-preview-image-cell': true
            }
        },

        /**
         * Get image source data per row.
         *
         * @param {Object} row
         * @returns {String}
         */
        getSrc: function (row) {
            return row[this.index + '_src'];
        },

        /**
         * Retrieve the original images src to be displayed at full size in the modal
         *
         * @param {Object} row
         * @returns {*}
         */
        getOrigSrc: function (row) {
            return row[this.index + '_orig_src'];
        },

        /**
         * Get alternative text data per row.
         *
         * @param {Object} row
         * @returns {String}
         */
        getAlt: function (row) {
            return _.escape(row[this.index + '_alt']);
        },

        /**
         * Check if preview available.
         *
         * @returns {Boolean}
         */
        isPreviewAvailable: function () {
            return this['has_preview'] || false;
        },

        /**
         * Build preview.
         *
         * @param {Object} row
         */
        preview: function (row) {
            var modalHtml = mageTemplate(
                thumbnailPreviewTemplate,
                {
                    src: this.getOrigSrc(row),
                    alt: this.getAlt(row)
                }
            ),
                previewPopup = $('<div/>').html(modalHtml);

            previewPopup.modal({
                title: this.getAlt(row),
                innerScroll: true,
                modalClass: '_image-box',
                buttons: []
            }).trigger('openModal');
        },

        /**
         * Get field handler per row.
         *
         * @param {Object} row
         * @returns {Function}
         */
        getFieldHandler: function (row) {
            if (this.isPreviewAvailable()) {
                return this.preview.bind(this, row);
            }
        }
    });
});
