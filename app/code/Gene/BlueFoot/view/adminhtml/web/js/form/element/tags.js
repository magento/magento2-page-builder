/**
 * Tags UI Component
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
