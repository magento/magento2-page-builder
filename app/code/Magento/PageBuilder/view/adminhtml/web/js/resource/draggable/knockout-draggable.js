/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict*/

define(["knockout", "jquery", "Magento_Ui/js/lib/core/events", "jquery/ui"],
    function(ko, jQuery, events) {

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
            containment: 'body',
            connectToSortable: '.pagebuilder-sortable',
            appendTo: document.body,
            helper: function(event) {
                var clone = jQuery(event.currentTarget).clone();

                clone.css('pointerEvents', 'none');
                return clone;
            }
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
                    // Ensure the dimensions are retained on the element
                    ui.helper.css({width: ui.helper.width(), height: ui.helper.height()});
                    events.trigger("drag:start", {event: event, ui: ui, component: getViewModelFromEvent(event)});
                    events.trigger("interaction:start", {stage: getViewModelFromEvent(event).stage});
                })
                .on('dragstop', function (event, ui) {
                    events.trigger("drag:stop", {event: event, ui: ui, component: getViewModelFromEvent(event)});
                    events.trigger("interaction:stop", {stage: getViewModelFromEvent(event).stage});
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
    ko.bindingHandlers.oldDraggable = {

        /**
         * Init the draggable binding on an element
         *
         * @param element
         * @param valueAccessor
         * @param allBindingsAccessor
         * @param data
         * @param context
         */
        init: function (element, valueAccessor, allBindingsAccessor) {
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
