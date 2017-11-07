/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(["knockout", "jquery", "underscore", "jquery/ui"], function(ko, jQuery, _) {

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

                var parentContainerName = ko.dataFor(jQuery(event.target)[0]).config.name,
                    allowedParents = getViewModelFromUi(ui).config.allowed_parents;

                if (parentContainerName && Array.isArray(allowedParents)) {
                    if (allowedParents.indexOf(parentContainerName) === -1) {
                        jQuery(this).sortable("cancel");
                        jQuery(ui.item).remove();

                        // Force refresh of the parent
                        var data = getViewModelFromUi(ui).parent.children().slice(0);
                        getViewModelFromUi(ui).parent.children([]);
                        getViewModelFromUi(ui).parent.children(data);
                        return;
                    }
                }

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
         * Hide or show the placeholder based on the elements allowed parents
         *
         * @param event
         * @param ui
         * @returns {*}
         */
        onSortChange: function (event, ui) {
            var parentContainerName = ko.dataFor(jQuery(event.target)[0]).config.name;
            currentInstance = getViewModelFromUi(ui);

            // If the registry contains a reference to the drag element view model use that instead
            if (require("uiRegistry").get('dragElementViewModel')) {
                currentInstance = require("uiRegistry").get('dragElementViewModel');
            }

            var allowedParents = currentInstance.config.allowed_parents;

            // Verify if the currently dragged block is accepted by the hovered parent
            if (parentContainerName && Array.isArray(allowedParents)) {
                if (allowedParents.indexOf(parentContainerName) === -1) {
                    ui.placeholder.hide();
                } else {
                    ui.placeholder.show();
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
