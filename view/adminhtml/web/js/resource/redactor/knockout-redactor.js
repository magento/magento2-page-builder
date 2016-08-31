(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "Gene_BlueFoot/js/resource/redactor/library/redactor", "mage/translate"], factory);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS module
        var ko = require("knockout"),
            jQuery = require("jquery"),
            Dropzone = require("Gene_BlueFoot/js/resource/redactor/library/redactor");

        factory(ko, jQuery, Dropzone, translate);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, window.jQuery, window.Redactor);
    }
})(function (ko, jQuery, Redactor) {

    // Create a new sortable Knockout binding
    ko.bindingHandlers.redactor = {

        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            var el = jQuery(element);
            el.redactor({

            });
        }

    };
});