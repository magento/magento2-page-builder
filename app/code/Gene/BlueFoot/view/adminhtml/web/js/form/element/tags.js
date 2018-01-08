/*eslint-disable vars-on-top, strict */
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * Tags UI Component
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'jquery',
    'Gene_BlueFoot/js/resource/jquery/tag-it/tag-it.min'
], function (AbstractField, $) {
    'use strict';

    return AbstractField.extend({

        /**
         * Attach our tag it system to the field
         *
         * @param element
         */
        attachTagFunctionality: function (element) {
            // Defer initialization of plugin to ensure value is present
            setTimeout(function () {
                // Attach the tags jQuery plugin
                $(element).tagit({
                    singleFieldDelimiter: ' '
                });
            }, 0);
        },

    });
});
