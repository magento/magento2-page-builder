;(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "underscore", "jquery/ui"], factory);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS module
        var ko = require("knockout"),
            jQuery = require("jquery"),
            _ = require("underscore");
        require("jquery/ui");
        factory(ko, jQuery, _);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, window.jQuery, window._);
    }
})(function(ko, jQuery, _) {

    /**
     * Retrieve the view model for an element
     *
     * @param ui
     * @returns {{}}
     */
    function getViewModelFromUi(ui) {
        return ko.dataFor(ui.item[0]) || {};
    }

    var Sortable = {
        defaults: {
            tolerance: 'pointer',
            cursorAt: {
                top: 0,
                left: 0
            },
            cursor: 'move',
            connectWith: '.bluefoot-sortable',
            helper: function (event, element) {
                var ele = jQuery('<div />');
                if (element.children().first().hasClass('bluefoot-entity')) {
                    ele.addClass('bluefoot-entity-helper').data('sorting', true);
                } else {
                    ele.addClass('bluefoot-structure-helper').data('sorting', true);
                }
                return ele;
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
            var config = this._getConfig(extendedConfig);

            // Init sortable on our element with necessary event handlers
            element
                .addClass(config.sortableClass)
                .sortable(config)
                .on('sortstart', this.onSortStart)
                .on('sortstop', this.onSortStop)
                .on('sortupdate', this.onSortUpdate)
                .on('sortchange', this.onSortChange)
                .on('sortbeforestop', this.onSortBeforeStop)
                .on('sortreceive', this.onSortReceive);
        },

        /**
         * Return the draggable config
         *
         * @param extendedConfig
         * @returns {Sortable.defaults|{scroll, revert, revertDuration, helper, zIndex}}
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
         * Handle sort start
         *
         * @param event
         * @param ui
         */
        onSortStart: function (event, ui) {
            var block = getViewModelFromUi(ui),
                eventData = {
                    event: event,
                    helper: ui.helper,
                    placeholder: ui.placeholder,
                    originalEle: ui.item
                };

            // Store the original parent for use in the update call
            block.originalParent = block.parent || false;

            // ui.helper.data('sorting') is appended to the helper of sorted items
            if (block && typeof block.emit === 'function' && jQuery(ui.helper).data('sorting')) {
                // ui.position to ensure we're only reacting to sorting events
                block.emit('sortStart', eventData);
                eventData['block'] = block;
                block.stage.emit('sortingStart', eventData);
            }
        },

        /**
         * Handle sort stop
         *
         * @param event
         * @param ui
         */
        onSortStop: function (event, ui) {
            var block = getViewModelFromUi(ui),
                eventData = {
                    event: event,
                    helper: ui.helper,
                    placeholder: ui.placeholder,
                    originalEle: ui.item
                };

            // ui.helper.data('sorting') is appended to the helper of sorted items
            if (block && typeof block.emit === 'function' && jQuery(ui.helper).data('sorting')) {
                // ui.position to ensure we're only reacting to sorting events
                block.emit('sortStop', eventData);
                eventData['block'] = block;
                block.stage.emit('sortingStop', eventData);
            }
        },

        /**
         * Handle a sort update event, this occurs when a sortable item is sorted
         *
         * @param event
         * @param ui
         */
        onSortUpdate: function (event, ui) {
            var blockEl = ui.item,
                newParentEl = blockEl.parent()[0],
                newIndex = blockEl.index();

            if (blockEl && (newParentEl === this)) {
                var block = ko.dataFor(blockEl[0]),
                    newParent = ko.dataFor(newParentEl);

                // Detect if we're sorting items within the stage
                if (typeof newParent.stageId === 'function' && newParent.stageId()) {
                    newParent = block.stage;
                }

                // Fire our events on the various parents of the operation
                if (block !== newParent) {
                    ui.item.remove();
                    if (block.originalParent === newParent) {
                        newParent.emit('blockSorted', {
                            block: block,
                            index: newIndex
                        });
                    } else {
                        block.originalParent.emit('blockRemoved', {
                            block: block
                        });
                        newParent.emit('blockInstanceDropped', {
                            blockInstance: block,
                            index: newIndex
                        });
                    }

                    block.originalParent = false;
                    jQuery(this).sortable('refresh');
                }
            }
        },

        /**
         * Attach an event for when sorting stops
         *
         * @param event
         * @param ui
         * @returns {*}
         */
        onSortChange: function (event, ui) {
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
        },

        /**
         * Handle capturing the dragged item just before the sorting stops
         *
         * @param event
         * @param ui
         */
        onSortBeforeStop: function (event, ui) {
            this.draggedItem = ui.item;
        },

        /**
         * Handle recieving a block from the panel
         *
         * @param event
         * @param ui
         */
        onSortReceive: function (event, ui) {
            if (jQuery(event.target)[0] === this) {
                var block = getViewModelFromUi(ui),
                    target = ko.dataFor(jQuery(event.target)[0]);

                if (block.droppable) {
                    event.stopPropagation();
                    // Emit the blockDropped event upon the target
                    target.emit('blockDropped', {
                        block: block,
                        index: this.draggedItem.index()
                    });
                    this.draggedItem.remove();
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