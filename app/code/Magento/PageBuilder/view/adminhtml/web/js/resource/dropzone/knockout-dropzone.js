/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD anonymous module
        define(['knockout', 'jquery', 'Magento_PageBuilder/js/resource/dropzone/dropzone', 'mage/translate'], factory);
    } else if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // CommonJS module
        var ko = require('knockout'),
            jQuery = require('jquery'),
            Dropzone = require('Magento_PageBuilder/js/resource/dropzone/dropzone'),
            translate = require('mage/translate');

        factory(ko, jQuery, Dropzone, translate);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, window.jQuery, window.Dropzone, window.translate);
    }
})(function (ko, jQuery, Dropzone, $t) {

    // Create a new sortable Knockout binding
    ko.bindingHandlers.dropzone = {

        /**
         * Init the dropzone element
         *
         * @param element
         * @param valueAccessor
         */
        init: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor()),
                originalSuccess = value.success,
                options = {
                    uploadMultiple: false,
                    createImageThumbnails: false,
                    addRemoveLinks: false,
                    dictDefaultMessage: $t('Drop files here, or click to upload'),
                    init: function () {
                        // Add the current formKey into the request
                        this.on('sending', function (file, xhr, formData) {
                            formData.append('form_key', FORM_KEY);
                        });
                    },
                    success: function (file, response) {
                        return originalSuccess.call(this, file, response, value.bindKey);
                    }
                };

            // Delete the success value
            delete value.success;

            // Extend the options with the values provided
            jQuery.extend(options, value);

            jQuery(element).addClass('dropzone');
            new Dropzone(element, options);
        }

    };
});