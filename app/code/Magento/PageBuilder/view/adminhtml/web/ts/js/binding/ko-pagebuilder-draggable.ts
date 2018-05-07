/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * The draggable binding is an adapter for the jQuery UI draggable widget.
 * Source: <Magento_Pagebuilder_module_dir>/view/adminhtml/web/js/resource/sortable/ko-pagebuilder-draggable. See on Github.
 * Value type: Object.
 * Configuration for the draggable widget.
 * Aliases: [ko-pagebuilder-draggable]
 * Usage example:
 * <div ko-pagebuilder-draggable="{ connectToSortable: getDraggableConfig() }"></div>
 */

import ko from "knockout";
import jQuery from "jquery";
import EventBus from "Magento_PageBuilder/js/component/event-bus";
import renderer from "Magento_Ui/js/lib/knockout/template/renderer";
import "jquery/ui"

/**
 * Retrieve the view model for an element
 *
 * @param {Event} event
 * @returns {Object}
 */
function getViewModelFromEvent(event: Event) {
    return ko.dataFor(jQuery(event.target)[0]) || {};
}

let Draggable = {
    defaults: {
        scroll: true,
        revert: true,
        revertDuration: 0,
        zIndex: 500,
        containment: 'body',
        connectToSortable: '.pagebuilder-sortable',
        appendTo: document.body,
        helper: function(event: Event) {
            let clone = jQuery(event.currentTarget).clone();

            clone.css('pointerEvents', 'none');
            return clone;
        }
    },

    /**
     * Init draggable on the elements
     *
     * @param {HTMLElement} elements
     * @param {Object} extendedConfig
     * @returns {HTMLElement}
     */
    init: function (elements: HTMLElement, extendedConfig: {}) {
        return jQuery(elements)
            .draggable(this._getConfig(extendedConfig))
            .on('dragstart', function (event: Event, ui: any) {
                // Ensure the dimensions are retained on the element
                ui.helper.css({width: ui.helper.width(), height: ui.helper.height()});
                EventBus.trigger("drag:start", {event: event, ui: ui, component: getViewModelFromEvent(event)});
                EventBus.trigger("interaction:start", {stage: getViewModelFromEvent(event).stage});
            })
            .on('dragstop', function (event: Event, ui: any) {
                EventBus.trigger("drag:stop", {event: event, ui: ui, component: getViewModelFromEvent(event)});
                EventBus.trigger("interaction:stop", {stage: getViewModelFromEvent(event).stage});
            });
    },

    /**
     * Return the draggable config
     *
     * @param {Object} extendedConfig
     * @returns {Draggable.defaults|{scroll, revert, revertDuration, helper, zIndex}}
     * @private
     */
    _getConfig: function (extendedConfig: {}) {
        let config = this.defaults;

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
     * @param {any} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindingsAccessor
     */
    init: function (element: any, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor) {
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

renderer.addAttribute('draggable', {
    name: 'ko-pagebuilder-draggable'
});
