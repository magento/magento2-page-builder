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

        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = allBindingsAccessor().value,
                defaults = {
                    callbacks: {
                        blur: function() {
                            value( this.code.get() );
                        }
                    }
                },
                options = valueAccessor();

            options = jQuery.extend(defaults, options);

            // bind and bindKey options - means the 'value' is stored within an object.
            if( typeof options.bind === 'function' && typeof options.bindKey == 'string' ) {
                value = function (newVal) {
                    var original = options.bind();
                    original[options.bindKey] = newVal;
                    options.bind(original);
                };
            }
            else if( typeof options.bind === 'function' ) {
                value = options.bind;
            }

            // Inline edit update
            if( typeof options.clickToEdit === 'boolean' && options.clickToEdit === true ) {
                // Set the value and hide redactor on click-out
                options.callbacks.blur = function () {
                    value( this.code.get() );

                    this.core.destroy();
                    this.$element.on('click.redactor-click-to-edit', jQuery.proxy(function()
                    {
                        this.initToEdit(options);
                    }, this));
                    this.$element.addClass('redactor-click-to-edit');
                }
            }

            jQuery(element).redactor(options);

            // Attach our own event to inject spaces - as there is an event further down which is preventing spaces from being added.
            jQuery(element).keydown(function(e) {
                if(e.which == 32) {
                    jQuery(this).redactor('insert.raw', '&nbsp;');
                    e.preventDefault();
                    return false;
                }
            });
        }

    };
});