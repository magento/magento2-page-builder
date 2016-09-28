/**
 * Redactor implementation for knockout
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define([
    "knockout",
    "jquery",
    "Gene_BlueFoot/js/resource/redactor/library/redactor",
    "Gene_BlueFoot/js/resource/redactor/plugins/magentovars",
    "Gene_BlueFoot/js/resource/redactor/plugins/font-size",
    "Gene_BlueFoot/js/resource/redactor/plugins/font-color"
], function (ko, jQuery, Redactor) {

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
                    callbacks: {
                        blur: function(e) {
                            value( this.code.get() );
                            this.$element.parent().removeClass('redactor-active');
                        }
                    },
                    plugins: ['magentoVars', 'fontSize', 'fontColor'],
                    buttons: ['bold', 'italic', 'deleted', 'lists', 'image', 'file', 'link']
                },
                options = valueAccessor(),
                recentValue = '';

            options = jQuery.extend(defaults, options);

            /**
             * Update a value on a binded element
             *
             * @param key
             * @param value
             */
            function updateValue(key, value) {
                var original = options.bind();
                original[key] = value;
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
                options.callbacks.blur = function (e) {
                    value( this.code.get() );

                    this.core.destroy();
                    this.$element.on('click.redactor-click-to-edit', jQuery.proxy(function()
                    {
                        this.initToEdit(options);
                    }, this));
                    this.$element.addClass('redactor-click-to-edit');

                    if (options.placeholder) {
                        if (options.bind()[options.bindKey] == '') {
                            value(options.placeholder);
                            this.$element.addClass('redactor-has-placeholder');
                        }
                        this.$element.parent().find('.redactor-click-to-edit').each(function (index, element) {
                            if (jQuery(element).text() == options.placeholder) {
                                jQuery(element).addClass('redactor-has-placeholder');
                            } else {
                                jQuery(element).removeClass('redactor-has-placeholder');
                                console.log(jQuery(element));
                            }
                        });
                    }

                    this.$element.parent().removeClass('redactor-active');
                }
            }

            // Add a placeholder if the value is ''
            if (options.placeholder && (typeof options.bind()[options.bindKey] === 'undefined' || options.bind()[options.bindKey] == options.placeholder)) {
                value(options.placeholder);
                jQuery(element).addClass('redactor-has-placeholder');

                /**
                 * On init set the value to '' if the placeholder is set
                 */
                options.callbacks.init = function () {
                    if (options.bind()[options.bindKey] == options.placeholder) {
                        value('');
                    }

                    this.$element.parent().find('.redactor-click-to-edit').each(function (index, element) {
                        if (jQuery(element).text() == options.placeholder) {
                            jQuery(element).addClass('redactor-has-placeholder');
                        } else {
                            jQuery(element).removeClass('redactor-has-placeholder');
                        }
                    });
                };

                /**
                 * On focus update the value to '' and use the placeholder instead
                 */
                options.callbacks.focus = function () {
                    this.$element.parent().addClass('redactor-active');
                    if (this.code.get() == options.placeholder) {
                        this.code.set('');
                    }
                };

                /**
                 * On value change evaluate the contents to modify the classes
                 */
                options.callbacks.keyup = function () {
                    recentValue = this.code.get();
                    this.$element.parent().find('.redactor-in').each(function (index, element) {
                        jQuery(element).removeClass('redactor-has-placeholder');
                        if (jQuery(element).text() == options.placeholder || jQuery(element).text() == '') {
                            jQuery(element).addClass('redactor-has-placeholder');
                        }
                    }.bind(this));
                };
            }

            // Update any default values needed
            if (options.default) {
                jQuery.each(options.default, function (key, defaultValue) {
                    if (typeof options.bind()[key] === 'undefined' || options.bind()[key] == '') {
                        updateValue(key, defaultValue);
                    }
                });

                options.bind.subscribe(function (newValue) {
                    if (options.placeholder) {
                        if (recentValue != options.placeholder && recentValue != '' && recentValue != newValue[options.bindKey]) {
                            jQuery(element).parent().find('.redactor-click-to-edit').removeClass('redactor-has-placeholder');
                            value(recentValue);
                        }
                        if (newValue[options.bindKey] == '') {
                            value(options.placeholder);
                            jQuery(element).addClass('redactor-has-placeholder');
                        }

                        jQuery(element).parent().find('.redactor-click-to-edit').each(function (index, element) {
                            if (jQuery(element).text() == options.placeholder) {
                                jQuery(element).addClass('redactor-has-placeholder');
                            } else {
                                jQuery(element).removeClass('redactor-has-placeholder');
                            }
                        });
                    }
                });
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