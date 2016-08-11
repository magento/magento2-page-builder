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
            helper: 'clone',
            zIndex: 500,
            connectToSortable: '.gene-bluefoot-sortable',
        },

        /**
         * Init draggable on the elements
         *
         * @param elements
         * @param extendedConfig
         * @returns {*}
         */
        init: function (elements, extendedConfig) {
            return jQuery(elements)
                .draggable(this._getConfig(extendedConfig))
                .on('dragstart', this.onDragStart.bind(this))
                .on('dragstop', this.onDragStop.bind(this))
                .on('drag', this.onDrag.bind(this));
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
         * Event fired on drag start
         *
         * @param event
         * @param ui
         * @returns {boolean}
         */
        onDragStart: function (event, ui) {
            return true;
        },

        /**
         * Event fired on drag stop
         *
         * @param event
         * @param ui
         * @returns {boolean}
         */
        onDragStop: function (event, ui) {
            return true;
        },

        /**
         * Event fired on a general drag
         *
         * @param event
         * @param ui
         * @returns {boolean}
         */
        onDrag: function (event, ui) {
            return true;
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
        }

    };

    var Sortable = {
        defaults: {
            tolerance: 'pointer',
            connectWith: '.gene-bluefoot-sortable',
            helper: 'clone'
        },

        /**
         * Init draggable on the elements
         *
         * @param element
         * @param extendedConfig
         * @returns {*}
         */
        init: function (element, extendedConfig) {
            return jQuery(element)
                .addClass('gene-bluefoot-sortable')
                .sortable(this._getConfig(extendedConfig));
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