/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Block from "./block";
import $ from "jquery";
import ko from "knockout";
import _ from "underscore";
import registry from "uiRegistry";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {ConfigContentBlock} from "../config";
import Appearance from "../appearance/appearance";
import {
    createColumn, getAcceptedColumnWidth, getSmallestColumnWidth, getColumnWidth,
    getMaxColumns, updateColumnWidth
} from "./column/utils";
import Column from "./column";
import {moveArrayItem, moveArrayItemIntoArray} from "../../utils/array";

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

        this.children.subscribe(
            _.debounce(() => this.bindDraggable(this.groupElement), 50)
        );
    }

    /**
     * Bind draggable instances to the child columns
     *
     * @param {JQuery} group
     */
    private bindDraggable(group: JQuery) {
        let internalColumns = group.find('>.bluefoot-column');
        internalColumns.draggable({
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
                // Use the global registry as columns can be dragged between groups
                registry.set('pageBuilderDragColumn', {
                    element: jQuery(event.target),
                    instance: ko.dataFor(jQuery(event.target)[0])
                });
                this.dropPositions = this.calculateDropPositions(group);
            },
            stop: (event) => {
                const column = registry.get('pageBuilderDragColumn');
                if (this.movePosition && column) {
                    // Check if we're moving within the same group, even though this function will only ever run on the
                    // group that bound the draggable event
                    if (column.instance.parent === this) {
                        const currentIndex = this.children().indexOf(column.instance);
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

                registry.remove('pageBuilderDragColumn');

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
        group.mousemove((e) => {
            this.handleResizingMouseMove(e, group);
            this.handleDraggingMouseMove(e, group);
            this.handleDroppingMouseMove(e, group);
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
     * @param e
     * @param group
     */
    private handleResizingMouseMove(e, group) {
        let currentPos: number,
            currentCol;

        if (this.resizeMouseDown) {
            e.preventDefault();
            currentPos = e.pageX;

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
                currentCol = _.find(this.resizeColumnWidths, function (val) {
                    if (currentPos > (val.position - 15) && currentPos < (val.position + 15)) {
                        return val;
                    }
                });

                if (currentCol) {
                    this.resizeColumn(this.resizeColumnInstance, currentCol.width);
                }
            }
        }
    }

    /**
     * Handle a column being dragged around the group
     *
     * @param e
     * @param group
     */
    private handleDraggingMouseMove(e, group) {
        if (registry.get('pageBuilderDragColumn')) {
            // If the drop positions haven't been calculated for this group do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = this.calculateDropPositions(group);
            }
            const columnInstance = registry.get('pageBuilderDragColumn').instance,
                currentX = e.pageX - $(group).offset().left;

            // Are we within the same column group or have we ended up over another?
            if (columnInstance.parent === this) {
                let currentColumn = registry.get('pageBuilderDragColumn').element,
                    lastColInGroup = $(group).find('.bluefoot-column:last-child'),
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
     * @param e
     * @param group
     */
    private handleDroppingMouseMove(e, group) {
        if (this.dropOverElement) {
            const currentX = e.pageX - $(group).offset().left;
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
     * Resize a column to a specific width
     *
     * @param {Column} column
     * @param {number} width
     */
    private resizeColumn(column: Column, width: number) {
        const current = getColumnWidth(column),
            difference = (parseFloat(width) - current).toFixed(8);

        // Don't run the update if we've already modified the column
        if (current === parseFloat(width)) {
            return;
        }

        updateColumnWidth(column, width);

        if (difference) {
            this.resizeAdjacentColumn(column, difference);
        }
    }

    /**
     * Resize the adjacent column to the current
     *
     * @param {Column} column
     * @param {number} difference
     */
    private resizeAdjacentColumn(column: Column, difference: number) {
        const columnIndex = this.children().indexOf(column);
        if (typeof this.children()[columnIndex + 1] !== 'undefined') {
            const adjacentColumn = this.children()[columnIndex + 1],
                currentAdjacent = getColumnWidth(adjacentColumn);
            let newWidth = currentAdjacent + -difference;

            updateColumnWidth(adjacentColumn, getAcceptedColumnWidth(newWidth));
        }
    }

    /**
     * Register a resize handle within a child column, this is called from the column itself
     *
     * @param {Column} column
     * @param {JQuery} handle
     */
    public registerResizeHandle(column: Column, handle: JQuery) {
        $(handle).mousedown((e) => {
            e.preventDefault();
            this.resizing(true);

            this.resizeColumnInstance = column;
            this.resizeColumnElement = handle.parents('.bluefoot-column');
            this.resizeColumnWidths = this.determineColumnWidths(this.resizeColumnElement, this.groupElement);
            this.resizeColumnLeft = this.resizeColumnElement.offset().left;

            const currentIndex = this.children().indexOf(column);
            if (typeof this.children()[currentIndex + 1] !== 'undefined') {
                this.resizeNextColumn = this.children()[currentIndex + 1];
            }
            this.resizeMaxGhostWidth = null;
            this.resizeMouseDown = true;
        });
    }

    /**
     * Determine the pixel position of every column that can be created within the group
     *
     * @param {JQuery} column
     * @param {JQuery} group
     * @returns {any[]}
     */
    private determineColumnWidths(column: JQuery, group: JQuery) {
        const columnWidth = group.width() / getMaxColumns(),
            groupLeftPos = column.offset().left;
        let columnWidths = [],
            columnLeftPos;

        for (let i = getMaxColumns(); i > 0; i--) {
            columnWidths.push({
                position: Math.round(groupLeftPos + columnWidth * i),
                name: i + '/' + getMaxColumns(),
                width: (100 / getMaxColumns() * i).toFixed(
                    Math.round((100 / getMaxColumns() * i)) !== (100 / getMaxColumns() * i) ? 8 : 0
                )
            });
        }

        return columnWidths;
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
     * Init the droppable functionality for new columns
     *
     * @param element
     */
    private initDroppable(element: Element) {
        let currentDraggedBlock;

        $(element).droppable({
            greedy: true,
            activate: (event) => {
                currentDraggedBlock = ko.dataFor(event.currentTarget);
            },
            over: (event) => {
                // Always calculate drop positions when an element is dragged over
                this.dropPositions = this.calculateDropPositions(element);

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
            drop: (e, ui) => {
                this.handleNewColumnDrop(e, ui);
                this.handleExistingColumnDrop(e, ui);
                this.dropPositions = [];
                this.dropPlaceholder.removeClass('left right');
            }
        });
    }

    /**
     * Handle a new column being dropped into the group
     *
     * @param e
     * @param ui
     */
    private handleNewColumnDrop(e, ui) {
        if (this.dropOverElement && this.dropPosition) {
            this.dropOverElement = false;

            e.preventDefault();
            e.stopImmediatePropagation();

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
     * @param e
     * @param ui
     */
    private handleExistingColumnDrop(e, ui) {
        const column = registry.get('pageBuilderDragColumn');
        let modifyOldNeighbour;
        // This should only run when we're dragging between groups
        if (this.movePosition && column && column.instance.parent !== this) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // Determine which old neighbour we should modify
            const currentParentChildren = column.instance.parent.children(),
                oldIndex = currentParentChildren.indexOf(column.instance),
                oldWidth = getColumnWidth(column.instance);
            console.log(this.stage.store.get(column.instance.id));
            if (typeof currentParentChildren[oldIndex + 1] !== 'undefined') {
                modifyOldNeighbour = currentParentChildren[oldIndex + 1];
            } else if (typeof currentParentChildren[oldIndex - 1] !== 'undefined') {
                modifyOldNeighbour = currentParentChildren[oldIndex - 1];
            }

            // Set the column to it's smallest column width
            updateColumnWidth(column.instance, getSmallestColumnWidth());

            column.instance.parent.removeChild(column.instance);
            this.emit('blockInstanceDropped', {
                blockInstance: column.instance,
                index: this.movePosition.insertIndex
            });

            // Modify the old neighour
            if (modifyOldNeighbour) {
                const oldNeighbourWidth = getAcceptedColumnWidth(
                    oldWidth + getColumnWidth(modifyOldNeighbour)
                );
                console.log('old width', oldWidth, modifyOldNeighbour, getColumnWidth(modifyOldNeighbour));
                updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
            }

            // Modify the columns new neighbour
            const newNeighbourWidth = getAcceptedColumnWidth(
                getColumnWidth(this.movePosition.affectedColumn) - getSmallestColumnWidth()
            );
            console.log('new friend width', newNeighbourWidth);

            // Reduce the affected columns width by the smallest column width
            updateColumnWidth(this.movePosition.affectedColumn, newNeighbourWidth);
        }
    }

    /**
     * Calculate the various drop positions that columns can be added within
     *
     * @param element
     * @returns {any[]}
     */
    private calculateDropPositions(element) {
        let dropPositions = [];
        $(element).find('>*').each((index, column) => {
            const columnData = ko.dataFor(column);
                const left = $(column).position().left,
                    width = $(column).outerWidth();
            dropPositions.push({
                left: left,
                right: left + (width / 2),
                insertIndex: index,
                placement: 'left',
                affectedColumn: columnData,
                canShrink: getColumnWidth(columnData) > getSmallestColumnWidth()
            });
            dropPositions.push({
                left: left + (width / 2),
                right: left + width,
                insertIndex: index + 1,
                placement: 'right',
                affectedColumn: columnData,
                canShrink: getColumnWidth(columnData) > getSmallestColumnWidth()
            });
        });
        return dropPositions;
    }

    /**
     * Spread any empty space across the other columns
     *
     * @param event
     * @param params
     */
    private spreadWidth(event, params) {
        if (this.children().length === 0) {
            this.parent.removeChild(this);
            return;
        }

        const availableWidth = 100 - this.getColumnsWidth(),
            formattedAvailableWidth = parseFloat(availableWidth).toFixed(
                Math.round(availableWidth) !== availableWidth ? 8 : 0
            ),
            totalChildColumns = this.children().length;
        let allowedColumnWidths = [],
            spreadAcross = 1,
            spreadAmount;

        for (let i = getMaxColumns(); i > 0; i--) {
            allowedColumnWidths.push(parseFloat((100 / 6 * i).toFixed(
                Math.round((100 / 6 * i)) !== (100 / 6 * i) ? 8 : 0
            )));
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
                const currentWidth = getColumnWidth(columnToModify);
                updateColumnWidth(columnToModify, currentWidth + spreadAmount);
            }
        }
    }

    /**
     * Retrieve the total width of all columns in the group
     *
     * @returns {any}
     */
    private getColumnsWidth() {
        return this.children().map((column) => {
            return getColumnWidth(column);
        }).reduce((widthA, widthB) => {
            return widthA + (widthB ? widthB : 0);
        });
    }
}
