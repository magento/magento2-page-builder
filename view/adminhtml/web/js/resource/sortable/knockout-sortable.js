;(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "jquery/ui"], factory);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS module
        var ko = require("knockout"),
            jQuery = require("jquery");
        require("jquery/ui");
        factory(ko, jQuery);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, window.jQuery);
    }
})(function(ko, jQuery) {

    var Draggable = {
        defaults: {
            scroll: true,
            revert: true,
            revertDuration: 0,
            zIndex: 500,
            connectToSortable: '.bluefoot-sortable',
            appendTo: document.body,
            helper: 'clone'
        },

        /**
         * Init draggable on the elements
         *
         * @param elements
         * @param extendedConfig
         * @returns {*}
         */
        init: function (elements, extendedConfig) {
            var self = this;
            return jQuery(elements)
                .draggable(this._getConfig(extendedConfig))
                .on('dragstart', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onDragStart.apply(this, arguments);
                })
                .on('dragstop', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onDragStop.apply(this, arguments);
                });
        },

        /**
         * Return the draggable config
         *
         * @param extendedConfig
         * @returns {Draggable.defaults|{scroll, revert, revertDuration, helper, zIndex}}
         * @private
         */
        _getConfig: function (extendedConfig) {
            var config = this.defaults;

            // Extend the config with any custom configuration
            if (extendedConfig) {
                if (typeof extendedConfig === 'function') {
                    extendedConfig = extendedConfig();
                }
                config = ko.utils.extend(config, extendedConfig);
            }

            return config;
        },

        /**
         * Attach an event when a user starts dragging elements
         *
         * @param event
         * @param ui
         * @param self
         * @returns {*}
         */
        onDragStart: function (event, ui, self) {
            var koElement = ko.dataFor(jQuery(event.target)[0]);
            if (koElement && typeof koElement.onDragStart === 'function') {
                return koElement.onDragStart(this, event, ui, self);
            }
        },

        /**
         * Attach an event when a user stops dragging elements
         *
         * @param event
         * @param ui
         * @param self
         * @returns {*}
         */
        onDragStop: function (event, ui, self) {
            var koElement = ko.dataFor(jQuery(event.target)[0]);
            if (koElement && typeof koElement.onDragStop === 'function') {
                return koElement.onDragStop(this, event, ui, self);
            }
        }

    };

    // Create a new draggable Knockout binding
    ko.bindingHandlers.draggable = {

        /**
         * Init the draggable binding on an element
         *
         * @param element
         * @param valueAccessor
         * @param allBindingsAccessor
         * @param data
         * @param context
         */
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            // Initialize draggable on all children of the element
            Draggable.init(jQuery(element).children(), valueAccessor);

            // Does the element contain a foreach element that could change overtime?
            if (allBindingsAccessor().foreach) {
                allBindingsAccessor().foreach.subscribe(function () {
                    Draggable.init(jQuery(element).children(), valueAccessor);
                });
            }
        }

    };

    var Sortable = {
        draggedItem: false,
        ranOnSort: false,
        callbackTarget: false,
        defaults: {
            callbackTarget: false,
            tolerance: 'pointer',
            cursorAt: {
                top: 0,
                left: 0
            },
            cursor: 'move',
            connectWith: '.bluefoot-sortable',
            helper: function (event, element) {
                if (element.children().first().hasClass('bluefoot-entity')) {
                    return jQuery('<div />').addClass('bluefoot-entity-helper');
                } else {
                    return jQuery('<div />').addClass('bluefoot-structure-helper');
                }
            },
            appendTo: document.body,
            placeholder: {
                element: function (clone) {
                    if (clone.hasClass('bluefoot-draggable-block')) {
                        return jQuery('<div />').addClass('bluefoot-draggable-block bluefoot-placeholder').append(clone.html());
                    }

                    return jQuery('<div />').addClass('bluefoot-placeholder-sortable');
                },
                update: function (clone, ui) {
                    return;
                }
            },
            sortableClass: 'bluefoot-sortable'
        },

        /**
         * Init draggable on the elements
         *
         * @param element
         * @param extendedConfig
         * @returns {*}
         */
        init: function (element, extendedConfig) {
            var self = this,
                config = this._getConfig(extendedConfig);

            // Have we been passed a callback target?
            if (typeof config.callbackTarget !== 'undefined') {
                self.callbackTarget = config.callbackTarget;
            }

            return jQuery(element)
                .addClass(config.sortableClass)
                .sortable(config)
                .on('sortstart', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onSortStart.apply(this, arguments);
                })
                .on('sortstop', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onSortStop.apply(this, arguments);
                })
                .on('sortreceive', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onSortReceive.apply(this, arguments);
                })
                .on('sortupdate', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onSortUpdate.apply(this, arguments);
                })
                .on('sortbeforestop', function (event, ui) {
                    self.draggedItem = ui.item;
                })
                .on('sortchange', function (event, ui) {
                    [].push.call(arguments, self);
                    return self.onSortChange.apply(this, arguments);
                });
        },

        /**
         * Return the draggable config
         *
         * @param extendedConfig
         * @returns {Draggable.defaults|{scroll, revert, revertDuration, helper, zIndex}}
         * @private
         */
        _getConfig: function (extendedConfig) {
            var config = this.defaults;

            // Extend the config with any custom configuration
            if (extendedConfig) {
                if (typeof extendedConfig === 'function') {
                    extendedConfig = extendedConfig();
                }
                config = ko.utils.extend(config, extendedConfig);
            }

            return config;
        },

        /**
         * Attach an event when a user starts sorting elements
         *
         * @param event
         * @param ui
         * @param self
         */
        onSortStart: function (event, ui, self) {
            if (self.callbackTarget && typeof self.callbackTarget.onSortStart === 'function') {
                return self.callbackTarget.onSortStart(this, event, ui, self);
            }

            var koElement = ko.dataFor(ui.item[0]);
            if (koElement && typeof koElement.onSortStart === 'function') {
                return koElement.onSortStart(this, event, ui, self);
            }
        },

        /**
         * Attach an event for when sorting stops
         *
         * @param event
         * @param ui
         * @param self
         * @returns {*}
         */
        onSortStop: function (event, ui, self) {
            self.ranOnSort = false;
            if (self.callbackTarget && typeof self.callbackTarget.onSortStop === 'function') {
                return self.callbackTarget.onSortStop(this, event, ui, self);
            }

            var koElement = ko.dataFor(ui.item[0]);
            if (koElement && typeof koElement.onSortStop === 'function') {
                return koElement.onSortStop(this, event, ui, self);
            }
        },

        /**
         * Attach an event for when sorting stops
         *
         * @param event
         * @param ui
         * @param self
         * @returns {*}
         */
        onSortReceive: function (event, ui, self) {
            // If the element has a class of bluefoot-draggable-block it's been dragged in from the left hand side
            if (ui.item.hasClass('bluefoot-draggable-block')) {
                var koElement = ko.dataFor(ui.item[0]);
                if (koElement && typeof koElement.onSortReceive === 'function') {
                    return koElement.onSortReceive(this, event, ui, self);
                }
            }

            // Refresh sortable to ensure any new elements are recognised
            jQuery(this).sortable('refresh');
        },

        /**
         * When a sort is updated we need to shift the elements in Knockout
         *
         * @param event
         * @param ui
         * @param self
         * @returns {boolean}
         */
        onSortUpdate: function (event, ui, self) {
            // If the element has a class of bluefoot-draggable-block it's been dragged in from the left hand side
            if (ui.item.hasClass('bluefoot-draggable-block')) {
                // Meaning it's not been "sorted"
                return false;
            }

            if (self.callbackTarget && typeof self.callbackTarget.onSortUpdate === 'function') {
                return self.callbackTarget.onSortUpdate(this, event, ui, self);
            }

            var koElement = ko.dataFor(ui.item[0]);
            if (koElement && typeof koElement.onSortUpdate === 'function') {
                return koElement.onSortUpdate(this, event, ui, self);
            }

            // Refresh sortable to ensure any new elements are recognised
            jQuery(this).sortable('refresh');
        },

        /**
         * Attach an event for when sorting stops
         *
         * @param event
         * @param ui
         * @param self
         * @returns {*}
         */
        onSortChange: function (event, ui, self) {
            if (!ui.item.hasClass('bluefoot-draggable-block')) {
                if (
                    (ui.placeholder.prev().is(ui.item) || ui.placeholder.next().is(ui.item))
                ) {
                    ui.placeholder.hide();
                } else {
                    ui.placeholder.show();

                    // If the next and previous items are columns add a class to the placeholder
                    if (ui.item.hasClass('bluefoot-column') &&
                        (ui.placeholder.prev().children().first().hasClass('bluefoot-column') ||
                        ui.placeholder.next().children().first().hasClass('bluefoot-column'))
                    ) {
                        ui.placeholder.addClass('bluefoot-placeholder-column');
                    } else {
                        ui.placeholder.removeClass('bluefoot-placeholder-column');
                    }
                }
            }
        }
    };

    // Create a new sortable Knockout binding
    ko.bindingHandlers.sortable = {

        /**
         * Init the draggable binding on an element
         *
         * @param element
         * @param valueAccessor
         * @param allBindingsAccessor
         * @param data
         * @param context
         */
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            // Initialize draggable on all children of the element
            Sortable.init(jQuery(element), valueAccessor);
        }

    };
});