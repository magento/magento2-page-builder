/**
 * - DragDrop.js
 * Handles drag & drop interactions with the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/jquery/ui', 'bluefoot/hook', 'jquery/ui-touch-punch'], function (jQuery, jQueryUi, Hook) {

    /**
     * Handles attaching and initializing the functionality to drag and drop various components between the panel
     * and the stage, and then around the stage.
     *
     * @param stage
     * @constructor
     */
    function DragDrop(stage) {
        this.stage = stage;
    }

    /**
     * Init the dragging of an element
     *
     * @param element
     * @param container
     */
    DragDrop.prototype.initDrag = function (element, container) {
        container = container || jQuery(element).parents('.gene-bluefoot-stage-container');
        jQuery(element).draggable({
            scroll: true,
            revert: true,
            revertDuration: 0,
            opacity: 0.7,
            helper: 'clone',
            connectToSortable: ".gene-bluefoot-droppable",
            zIndex: 1000,
            start: this.onDragStart.bind(this),
            stop: this.onDragStop.bind(this),
            drag: this.onDrag.bind(this)
        });
    };

    /**
     * Event for when dragging starts
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onDragStart = function (event, ui) {
        // Fix issues with cloned elements not retaining their widths
        var original = jQuery(event.target);
        var clone = jQuery(event.target).next();
        if (clone && original) {
            // Set the width and height of the clone
            clone.width(original.width()).height(original.height());
        }
    };

    /**
     * Event for when dragging stops
     * @param event
     * @param ui
     */
    DragDrop.prototype.onDragStop = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
    };

    /**
     * Event for when a user is dragging
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onDrag = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-restore-empty-text', false, false, this.stage);
    };

    /**
     * Init the drop functionality of rows, columns etc
     *
     * @param stage
     * @param element
     */
    DragDrop.prototype.initSortable = function (element) {
        if (!jQuery(element).hasClass('.gene-bluefoot-droppable')) {
            element = jQuery(element).find('>.gene-bluefoot-droppable');
            if (!element) {
                console.error('Unable to init sortable on ' + element);
                return false;
            }
        }

        // Sortable for entities within a row, we apply this to the parent so we can apply column sorting to the actual element
        jQuery(element).sortable({
            tolerance: 'pointer',
            connectWith: '.gene-bluefoot-droppable',
            helper: 'clone',
            cancel: 'a',
            items: '.gene-bluefoot-entity',
            opacity: 0.7,
            placeholder: {
                element: function (clone, ui) {
                    // If the clone is an anchor it's being dragged in from the left side
                    if (clone.is('a')) {
                        var element = clone.clone();
                        element.attr('style', '').addClass('gene-bluefoot-entity gene-bluefoot-entity-container gene-bluefoot-preview').removeClass('gene-bluefoot-draggable');
                        element.find('.gene-bluefoot-content-type-icon').attr('style', '');
                        return element;
                    }

                    // Otherwise return a standard div
                    return jQuery('<div />').addClass('gene-bluefoot-droparea')
                },
                update: function (clone, ui) {
                    return;
                }
            },
            over: this.onSortOver.bind(this),
            out: this.onSortOut.bind(this),
            sort: this.onSort.bind(this),
            change: this.onSortChange.bind(this),
            start: this.onSortStart.bind(this),
            stop: this.onSortStop.bind(this),
            receive: this.onSortReceive.bind(this),
            update: this.onSortUpdate.bind(this)
        });
    };

    /**
     * Over event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortOver = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
    };

    /**
     * Out event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortOut = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
    };

    /**
     * Sort event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSort = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-restore-empty-text', false, false, this.stage);
        var placeholder = jQuery(ui.placeholder);
        if (jQuery(ui.item).is('a')) {
            placeholder.hide();
        }

        if (placeholder.prev().hasClass('gene-bluefoot-column') && placeholder.next().hasClass('gene-bluefoot-column')) {
            placeholder.hide();
        } else {
            placeholder.show();
        }
    };

    /**
     * Change event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortChange = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
    };

    /**
     * Start event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortStart = function (event, ui) {
        if (!jQuery(ui.item).is('a')) {
            ui.placeholder.height(ui.item.outerHeight());
        }
    };

    /**
     * Stop event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortStop = function (event, ui) {
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
        Hook.trigger('gene-bluefoot-stage-restore-empty-text', false, false, this.stage);
        if (!jQuery(ui.item).is('a')) {
            jQuery(ui.helper).remove();
        }
    };

    /**
     * Receive event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortReceive = function (event, ui) {
        var helper = ui.helper;

        // 1.9.2 doesn't expose the ui.helper reference correctly
        if (jQuery.ui.version == '1.9.2') {
            helper = jQuery(event.target).find('.ui-draggable');
        }

        if (jQuery(ui.item).is('a')) {
            this.stage.addEntityFromClone(helper);
        } else {
            jQuery(helper).remove();
        }
    };

    /**
     * Update event from jQuery UI sortable
     *
     * @param event
     * @param ui
     */
    DragDrop.prototype.onSortUpdate = function (event, ui) {
        if (ui.item.data('class')) {
            var itemClass = ui.item.data('class');
            if (typeof itemClass.onSortComplete === 'function') {
                itemClass.onSortComplete();
            }
        }
    };

    return DragDrop;
});