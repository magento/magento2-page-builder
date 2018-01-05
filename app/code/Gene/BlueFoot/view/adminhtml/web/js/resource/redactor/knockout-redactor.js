/*eslint-disable vars-on-top, strict, max-len, no-unused-vars */
/**
 * Redactor implementation for knockout
 */
define([
    "knockout",
    "jquery",
    "Gene_BlueFoot/js/resource/redactor/library/redactor",
    "Gene_BlueFoot/js/resource/redactor/plugins/magentovars",
    "Gene_BlueFoot/js/resource/redactor/plugins/font-size",
    "Gene_BlueFoot/js/resource/redactor/plugins/font-color"
], function (ko, jQuery) {

    // Attach redactor plugins based on arguments passed to this function.
    for (var i=3; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
            arguments[i]();
        }
    }

    // Create a new sortable Knockout binding
    ko.bindingHandlers.redactor = {

        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = allBindingsAccessor().value,
                defaults = {
                    plugins: ['magentoVars', 'fontSize', 'fontColor'],
                    buttons: ['bold', 'italic', 'deleted', 'lists', 'image', 'file', 'link']
                },
                options = valueAccessor(),
                recentValue = '';

            // Default callbacks
            options.callbacks = {};
            options.callbacks.blur = function () {
                var newValue = this.code.get();

                // Strip HTML from the value
                if (options.stripHtml) {
                    var tmp = document.createElement("DIV");

                    tmp.innerHTML = newValue;
                    newValue = tmp.textContent || tmp.innerText || "";
                }

                value(newValue);
                this.$element.parent().removeClass('redactor-active');
            };
            options.callbacks.focus = function () {
                this.$element.parent().addClass('redactor-active');
            };

            options = jQuery.extend(defaults, options);

            /**
             * Update a value on a binded element
             *
             * @param key
             * @param val
             */
            function updateValue(key, val) {
                var original = options.bind();

                original[key] = val;
                options.bind(original);
            }

            // bind and bindKey options - means the 'value' is stored within an object.
            if (typeof options.bind === 'function' && typeof options.bindKey == 'string') {
                value = function (newVal) {
                    updateValue(options.bindKey, newVal);
                    recentValue = newVal;
                };
            }
            else if (typeof options.bind === 'function') {
                value = options.bind;
            }

            // Inline edit update
            if (typeof options.clickToEdit === 'boolean' && options.clickToEdit === true) {
                // Set the value and hide redactor on click-out
                options.callbacks.blur = function () {
                    value( this.code.get() );

                    this.core.destroy();
                    this.$element.on('click.redactor-click-to-edit', jQuery.proxy(function()
                    {
                        this.initToEdit(options);
                    }, this));
                    this.$element.addClass('redactor-click-to-edit');

                    this.$element.parent().removeClass('redactor-active');
                };
            }

            // Update any default values needed
            if (options.default) {
                jQuery.each(options.default, function (key, defaultValue) {
                    if (typeof options.bind()[key] === 'undefined' || options.bind()[key] === '') {
                        updateValue(key, defaultValue);
                    }
                });
            }

            jQuery(element).redactor(options);

            // Attach our own event to inject spaces - as there is an event further down which is preventing spaces from being added.
            jQuery(element).keydown(function(e) {
                if(e.which === 32) {
                    jQuery(this).redactor('insert.raw', '&nbsp;');
                    e.preventDefault();
                    return false;
                }
            });
        }

    };
});