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

    /**
     * Retrieve the view model for an element
     *
     * @param event
     * @returns {{}}
     */
    function getViewModelFromEvent(event) {
        return ko.dataFor(jQuery(event.target)[0]) || {};
    }

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
            return jQuery(elements)
                .draggable(this._getConfig(extendedConfig))
                .on('dragstart', function (event, ui) {
                    getViewModelFromEvent(event).emit('dragStart', {
                        event: event,
                        ui: ui
                    });
                })
                .on('dragstop', function (event, ui) {
                    getViewModelFromEvent(event).emit('dragStop', {
                        event: event,
                        ui: ui
                    });
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
        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            // Initialize draggable on all children of the element
            Draggable.init(jQuery(element), valueAccessor);

            // Does the element contain a foreach element that could change overtime?
            if (allBindingsAccessor().foreach) {
                allBindingsAccessor().foreach.subscribe(function () {
                    Draggable.init(jQuery(element).children(), valueAccessor);
                });
            }
        }

    };

});