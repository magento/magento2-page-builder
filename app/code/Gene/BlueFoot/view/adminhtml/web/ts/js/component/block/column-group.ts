/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Block from "./block";
import $ from "jquery";
import ko from "knockout";
import _ from "underscore";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {ConfigContentBlock} from "../config";
import Appearance from "../appearance/appearance";
import Column from "./column";
import {
    createColumn, getAcceptedColumnWidth, getSmallestColumnWidth, getColumnWidth,
    getMaxColumns, updateColumnWidth, calculateDropPositions, getRoundedColumnWidth, getColumnsWidth,
    determineColumnWidths, resizeColumn, getAdjacentColumn, getColumnIndexInGroup
} from "./column/utils";
import {moveArrayItem} from "../../utils/array";

export default class ColumnGroup extends Block {
    resizing: KnockoutObservable<boolean> = ko.observable(false);
    dropPlaceholder: JQuery;
    movePlaceholder: JQuery;
    groupElement: JQuery;

    resizeGhost: JQuery;
    resizeColumnInstance: Column;
    resizeColumnWidths: [] = [];
    resizeColumnElement: JQuery;
    resizeColumnLeft: number;
    resizeNextColumn: Column;
    resizeMaxGhostWidth: number;
    resizeMouseDown: boolean = false;

    dropOverElement: JQuery;
    dropPositions: [] = [];
    dropPosition: {};

    movePosition: {};

    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, formData, appearance);

        this.on('blockReady', this.addDefaultColumns.bind(this));
        this.on('blockRemoved', this.spreadWidth.bind(this));
    }

    /**
     * Init the droppable & resizing interactions
     *
     * @param group
     */
    public initInteractions(group: Element) {
        this.groupElement = $(group);
        this.initDroppable(this.groupElement);
        this.initMouseMove(this.groupElement);

        // We have to re-bind the draggable library to any new children that appear inside the group
        this.children.subscribe(
            _.debounce(() => this.bindDraggable(), 50)
        );
    }

    /**
     * Add the default columns to the group on creation
     */
    private addDefaultColumns() {
        if (this.children().length === 0) {
            createColumn(this, 50);
            createColumn(this, 50);
        }
    }

    /**
     * Init the drop placeholder
     *
     * @param element
     */
    public initDropPlaceholder(element: Element) {
        this.dropPlaceholder = $(element);
    }

    /**
     * Init the move placeholder
     *
     * @param {Element} element
     */
    public initMovePlaceholder(element: Element) {
        this.movePlaceholder = $(element);
    }

    /**
     * Bind draggable instances to the child columns
     *
     * @param {JQuery} group
     */
    private bindDraggable() {
        let internalColumns = this.children().map((column: Column) => {
            return column.element;
        });

        $(internalColumns).draggable({
            handle: '.move-column',
            appendTo: "body",
            revertDuration: 250,
            helper: function () {
                let helper = $(this).clone();
                helper.css({
                    'zIndex': 100001,
                    'pointerEvents': 'none',
                    'opacity': 0.5,
                    'width': $(this).width() + 'px'
                });
                return helper;
            },
            start: (event) => {
                // Use the globla state as columns can be dragged between groups
                this.stage.store.update(
                    'pageBuilderDragColumn',
                    {
                        element: $(event.target),
                        instance: ko.dataFor($(event.target)[0])
                    }
                )

                this.dropPositions = calculateDropPositions(this);
            },
            stop: (event) => {
                const column = this.stage.store.get('pageBuilderDragColumn');
                if (this.movePosition && column) {
                    // Check if we're moving within the same group, even though this function will only ever run on the
                    // group that bound the draggable event
                    if (column.instance.parent === this) {
                        const currentIndex = getColumnIndexInGroup(column.instance);
                        let newIndex = this.movePosition.insertIndex;
                        if (currentIndex !== newIndex) {
                            if (currentIndex < newIndex) {
                                // As we're moving an array item the keys all reduce by 1
                                --newIndex;
                            }
                            moveArrayItem(this.children, currentIndex, newIndex);
                        }
                        this.movePosition = null;
                    }
                }

                this.stage.store.remove('pageBuilderDragColumn');

                this.dropPlaceholder.removeClass('left right');
                this.movePlaceholder.removeClass('active');
            }
        });
    }

    /**
     * Retrieve the ghost element from the template
     *
     * @param {Element} ghost
     */
    public initGhost(ghost: Element) {
        this.resizeGhost = $(ghost);
    }

    /**
     * Init the resizing events on the group
     *
     * @param {Element} group
     */
    private initMouseMove(group: JQuery) {
        group.mousemove((event) => {
            this.handleResizingMouseMove(event, group);
            this.handleDraggingMouseMove(event, group);
            this.handleDroppingMouseMove(event, group);
        }).mouseout(() => {
            this.movePlaceholder.removeClass('active');
        }).mouseup(() => {
            this.resizing(false);
            this.resizeMouseDown = false;
            this.dropPositions = [];

            this.dropPlaceholder.removeClass('left right');
            this.movePlaceholder.removeClass('active');
        });
    }

    /**
     * Handle the resizing on mouse move
     *
     * @param event
     * @param group
     */
    private handleResizingMouseMove(event, group) {
        let currentPos: number,
            currentCol;

        if (this.resizeMouseDown) {
            event.preventDefault();
            currentPos = event.pageX;

            // Update the ghosts width and position to give a visual indication of the dragging
            let ghostWidth = currentPos - this.resizeColumnLeft;
            if (ghostWidth <= group.width() / getMaxColumns()) {
                ghostWidth = group.width() / getMaxColumns();
            }
            if (ghostWidth >= group.width() - this.resizeColumnElement.position().left) {
                ghostWidth = group.width() - this.resizeColumnElement.position().left;
            }

            // Make sure the user can't crush the adjacent column smaller than 1/6
            const adjacentWidth = getColumnWidth(this.resizeNextColumn);
            if (adjacentWidth === getSmallestColumnWidth() && ghostWidth > this.resizeColumnElement.width() || this.resizeMaxGhostWidth) {
                ghostWidth = (this.resizeMaxGhostWidth ? this.resizeMaxGhostWidth : this.resizeColumnElement.width());
                if (!this.resizeMaxGhostWidth) {
                    this.resizeMaxGhostWidth = this.resizeColumnElement.width();
                }
            }

            // Reset the max ghost width when the user moves back from the edge
            if (currentPos - this.resizeColumnLeft < this.resizeColumnElement.width()) {
                this.resizeMaxGhostWidth = null;
            }

            // We take the border width of the width to ensure it's under the mouse exactly
            this.resizeGhost.width(ghostWidth - 2 + 'px').css(
                'left',
                this.resizeColumnElement.position().left + 'px'
            );

            if (!this.resizeMaxGhostWidth) {
                currentCol = this.resizeColumnWidths.find((val) => {
                    return (currentPos > (val.position - 15) && currentPos < (val.position + 15));
                });

                if (currentCol) {
                    resizeColumn(this.resizeColumnInstance, currentCol.width);
                }
            }
        }
    }

    /**
     * Handle a column being dragged around the group
     *
     * @param event
     * @param group
     */
    private handleDraggingMouseMove(event, group) {
        let dragColumn = this.stage.store.get('pageBuilderDragColumn');
        if (dragColumn.element && dragColumn.instance) {
            // If the drop positions haven't been calculated for this group do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = calculateDropPositions(this);
            }
            const columnInstance = dragColumn.instance,
                currentX = event.pageX - $(group).offset().left;

            // Are we within the same column group or have we ended up over another?
            if (columnInstance.parent === this) {
                let currentColumn = dragColumn.element,
                    lastColInGroup = this.children()[this.children().length - 1].element,
                    insertLastPos = lastColInGroup.position().left + (lastColInGroup.width() / 2);

                // @todo don't show placeholder next to current column
                this.movePosition = this.dropPositions.find((position, index) => {
                    // Only ever look for the left placement, except the last item where we look on the right
                    const placement = (currentX >= insertLastPos ? 'right' : 'left');
                    // There is 200px area over each column borders @todo calculate this
                    if (currentX > position[placement] - 100 &&
                        currentX < position[placement] + 100 &&
                        position.affectedColumn !== columnInstance && // Verify the affected column isn't the current column
                        position.placement === placement// Verify the position, we only check left on sorting
                    ) {
                        return position;
                    }
                });

                if (this.movePosition) {
                    this.dropPlaceholder.removeClass('left right');
                    this.movePlaceholder.css({
                        left: (this.movePosition.placement === 'left' ? this.movePosition.left : ''),
                        // @todo investigate why we need to -5
                        right: (this.movePosition.placement === 'right' ? $(group).outerWidth() - this.movePosition.right - 5 : ''),
                    }).addClass('active');
                } else {
                    this.movePlaceholder.removeClass('active');
                }
            } else {
                this.movePosition = this.dropPositions.find((position) => {
                    if (currentX > position.left && currentX < position.right && position.canShrink) {
                        return position;
                    }
                });

                if (this.movePosition) {
                    this.movePlaceholder.removeClass('active');
                    this.dropPlaceholder.removeClass('left right').css({
                        width: $(group).width() / getMaxColumns() + 'px',
                        left: (this.movePosition.placement === 'left' ? this.movePosition.left : ''),
                        right: (this.movePosition.placement === 'right' ? $(group).width() - this.movePosition.right : ''),
                    }).addClass(this.movePosition.placement);
                } else {
                    this.dropPlaceholder.removeClass('left right');
                }
            }
        }
    }

    /**
     * Handle mouse move events on when dropping elements
     *
     * @param event
     * @param group
     */
    private handleDroppingMouseMove(event, group) {
        if (this.dropOverElement) {
            const currentX = event.pageX - $(group).offset().left;
            this.dropPosition = this.dropPositions.find((position) => {
                if (currentX > position.left && currentX < position.right && position.canShrink) {
                    return position;
                }
            });

            if (this.dropPosition) {
                this.dropPlaceholder.removeClass('left right').css({
                    width: $(group).width() / getMaxColumns() + 'px',
                    left: (this.dropPosition.placement === 'left' ? this.dropPosition.left : ''),
                    right: (this.dropPosition.placement === 'right' ? $(group).width() - this.dropPosition.right : ''),
                }).addClass(this.dropPosition.placement);
            }
        }
    }

    /**
     * Register a resize handle within a child column, this is called from the column itself
     *
     * @param {Column} column
     * @param {JQuery} handle
     */
    public registerResizeHandle(column: Column, handle: JQuery) {
        handle.mousedown((event) => {
            event.preventDefault();
            this.resizing(true);

            this.resizeColumnInstance = column;
            this.resizeColumnElement = column.element;
            this.resizeColumnWidths = determineColumnWidths(column, this.groupElement);
            this.resizeColumnLeft = this.resizeColumnElement.offset().left;

            this.resizeNextColumn = getAdjacentColumn(column, '+1');
            this.resizeMaxGhostWidth = null;
            this.resizeMouseDown = true;
        });
    }

    /**
     * Init the droppable functionality for new columns
     *
     * @param {Element} group
     */
    private initDroppable(group: Element) {
        let currentDraggedBlock;

        group.droppable({
            greedy: true,
            activate: (event: Event) => {
                currentDraggedBlock = ko.dataFor(event.currentTarget);
            },
            over: (event: Event) => {
                // Always calculate drop positions when an element is dragged over
                this.dropPositions = calculateDropPositions(this);

                // Is the element being dragged a column group?
                if (currentDraggedBlock.config.name === this.config.name) {
                    this.dropOverElement = true;
                }
            },
            deactivate: () => {
                this.dropOverElement = false;
                this.dropPlaceholder.removeClass('left right');
            },
            out: () => {
                this.dropOverElement = false;
                this.dropPlaceholder.removeClass('left right');
            },
            drop: (event: Event, ui: JQueryUI.DroppableEventUIParam) => {
                this.handleNewColumnDrop(event, ui);
                this.handleExistingColumnDrop(event);
                this.dropPositions = [];
                this.dropPlaceholder.removeClass('left right');
            }
        });
    }

    /**
     * Handle a new column being dropped into the group
     *
     * @param event
     * @param ui
     */
    private handleNewColumnDrop(event: Event, ui: JQueryUI.DroppableEventUIParam) {
        if (this.dropOverElement && this.dropPosition) {
            this.dropOverElement = false;

            event.preventDefault();
            event.stopImmediatePropagation();

            // Remove any dropped items from the DOM
            if (ui.draggable) {
                ui.draggable.remove();
            }

            // Create our new column
            createColumn(
                this,
                getSmallestColumnWidth(),
                this.dropPosition.insertIndex
            ).then(() => {
                const newWidth = getAcceptedColumnWidth(
                    getColumnWidth(this.dropPosition.affectedColumn) - getSmallestColumnWidth()
                );
                // Reduce the affected columns width by the smallest column width
                updateColumnWidth(this.dropPosition.affectedColumn, newWidth);
            });
        }
    }

    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {Event} event
     */
    private handleExistingColumnDrop(event: Event) {
        const column = this.stage.store.get('pageBuilderDragColumn');
        let modifyOldNeighbour;
        // This should only run when we're dragging between groups
        if (this.movePosition && column.element && column.instance && column.instance.parent !== this) {
            event.preventDefault();
            event.stopImmediatePropagation();

            // Determine which old neighbour we should modify
            const oldWidth = getColumnWidth(column.instance);

            // Retrieve the adjacent column either +1 or -1
            if (getAdjacentColumn(column.instance, '+1')) {
                modifyOldNeighbour = getAdjacentColumn(column.instance, '+1');
            } else if (getAdjacentColumn(column.instance, '-1')) {
                modifyOldNeighbour = getAdjacentColumn(column.instance, '-1');
            }

            // Set the column to it's smallest column width
            updateColumnWidth(column.instance, getSmallestColumnWidth());

            column.instance.parent.removeChild(column.instance);
            this.emit('blockInstanceDropped', {
                blockInstance: column.instance,
                index: this.movePosition.insertIndex
            });

            // Modify the old neighbour
            if (modifyOldNeighbour) {
                const oldNeighbourWidth = getAcceptedColumnWidth(
                    oldWidth + getColumnWidth(modifyOldNeighbour)
                );
                updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
            }

            // Modify the columns new neighbour
            const newNeighbourWidth = getAcceptedColumnWidth(
                getColumnWidth(this.movePosition.affectedColumn) - getSmallestColumnWidth()
            );

            // Reduce the affected columns width by the smallest column width
            updateColumnWidth(this.movePosition.affectedColumn, newNeighbourWidth);
        }
    }

    /**
     * Spread any empty space across the other columns
     *
     * @param {Event} event
     * @param params
     */
    private spreadWidth(event: Event, params) {
        if (this.children().length === 0) {
            this.parent.removeChild(this);
            return;
        }

        const availableWidth = 100 - getColumnsWidth(this),
            formattedAvailableWidth = getRoundedColumnWidth(availableWidth),
            totalChildColumns = this.children().length;
        let allowedColumnWidths = [],
            spreadAcross = 1,
            spreadAmount;

        for (let i = getMaxColumns(); i > 0; i--) {
            allowedColumnWidths.push(getRoundedColumnWidth(100 / 6 * i));
        }

        // Determine how we can spread the empty space across the columns
        traverseChildren: for (let i = totalChildColumns; i > 0; i--) {
            const potentialWidth = formattedAvailableWidth / i;
            for (let width of allowedColumnWidths) {
                if (Math.floor(potentialWidth) == Math.floor(width)) {
                    spreadAcross = i;
                    spreadAmount = formattedAvailableWidth / i;
                    break traverseChildren;
                }
            }
        }

        // Let's spread the width across the columns
        for (let i = 1; i <= spreadAcross; i++) {
            // Let's look left
            let columnToModify;

            // As the original column has been removed from the array, check the new index for a column
            if ((params.index) <= this.children().length && typeof this.children()[params.index] !== 'undefined') {
                columnToModify = this.children()[params.index];
            }
            // As far as I can tell this statement will never run, however leaving it in as it might when more columns are present
            if (!columnToModify && (params.index + i) <= this.children().length && typeof this.children()[params.index + i] !== 'undefined') {
                columnToModify = this.children()[params.index + i];
            }
            if (!columnToModify && (params.index - i) >= 0 && typeof this.children()[params.index - i] !== 'undefined') {
                columnToModify = this.children()[params.index - i];
            }
            if (columnToModify) {
                updateColumnWidth(columnToModify, getColumnWidth(columnToModify) + spreadAmount);
            }
        }
    }
}
