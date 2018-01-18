/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import ko from "knockout";
import registry from "uiRegistry";
import _ from "underscore";
import {moveArrayItem} from "../../utils/array";
import Appearance from "../appearance/appearance";
import {ConfigContentBlock} from "../config";
import Stage from "../stage";
import Structural from "../stage/structural/abstract";
import EditableArea from "../stage/structural/editable-area";
import Block from "./block";
import Column from "./column";
import {
    calculateDropPositions, createColumn, determineColumnWidths, DropPosition, findShrinkableColumnForResize,
    getAcceptedColumnWidth, getAdjacentColumn, getColumnIndexInGroup, getColumnsWidth, getColumnWidth,
    getMaxColumns, getRoundedColumnWidth, getSmallestColumnWidth, resizeColumn, updateColumnWidth,
} from "./column/utils";
import InlineBlock from "./inline";

export default class ColumnGroup extends Block {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    public dropPlaceholder: JQuery<HTMLElement>;
    public movePlaceholder: JQuery<HTMLElement>;
    public groupElement: JQuery<HTMLElement>;

    public resizeGhost: JQuery<HTMLElement>;
    public resizeColumnInstance: Column;
    public resizeColumnWidths: any[] = [];
    public resizeColumnElement: JQuery<HTMLElement>;
    public resizeColumnLeft: number;
    public resizeNextColumn: Column;
    public resizeMaxGhostWidth: number;
    public resizeMouseDown: number;
    public resizeLastColumnShrunk: Column;

    public dropOverElement: JQuery<HTMLElement>;
    public dropPositions: any[] = [];
    public dropPosition: DropPosition;

    public movePosition: DropPosition;

    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, formData, appearance);

        this.on("blockReady", this.addDefaultColumns.bind(this));
        this.on("blockRemoved", this.spreadWidth.bind(this));

        this.children.subscribe(
            _.debounce(
                this.removeIfEmpty.bind(this),
                50,
            ),
        );
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
            _.debounce(() => this.bindDraggable(), 50),
        );
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
     * Retrieve the ghost element from the template
     *
     * @param {Element} ghost
     */
    public initGhost(ghost: Element) {
        this.resizeGhost = $(ghost);
    }

    /**
     * Register a resize handle within a child column, this is called from the column itself
     *
     * @param {Column} column
     * @param {JQuery<HTMLElement>} handle
     */
    public registerResizeHandle(column: Column, handle: JQuery<HTMLElement>) {
        handle.mousedown((event) => {
            event.preventDefault();
            this.resizing(true);

            this.resizeColumnInstance = column;
            this.resizeColumnElement = column.element;
            this.resizeColumnWidths = determineColumnWidths(column, this.groupElement);
            this.resizeColumnLeft = this.resizeColumnElement.offset().left;

            this.resizeNextColumn = getAdjacentColumn(column, "+1");
            this.resizeMaxGhostWidth = null;
            this.resizeMouseDown = event.pageX;
        });
    }

    /**
     * Duplicate a child of the current instance
     *
     * @param {Column} child
     * @param {boolean} autoAppend
     * @returns {Structural}
     */
    public duplicateChild(child: Column, autoAppend: boolean = true): Structural {
        // Attempt to split the current column into parts
        let splitTimes = Math.round(getColumnWidth(child) / getSmallestColumnWidth());
        if (splitTimes > 1) {
            const duplicate = super.duplicateChild(child, autoAppend) as Column;
            let originalWidth = 0;
            let duplicateWidth = 0;

            for (let i = 0; i <= splitTimes; i++) {
                if (splitTimes > 0) {
                    originalWidth += getSmallestColumnWidth();
                    --splitTimes;
                }
                if (splitTimes > 0) {
                    duplicateWidth += getSmallestColumnWidth();
                    --splitTimes;
                }
            }
            updateColumnWidth(child, getAcceptedColumnWidth(originalWidth.toString()));
            updateColumnWidth(duplicate, getAcceptedColumnWidth(duplicateWidth.toString()));
            return duplicate;
        }
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
     * Bind draggable instances to the child columns
     */
    private bindDraggable() {
        this.children().forEach((column: Column) => {
            column.element.draggable({
                appendTo: "body",
                handle: ".move-column",
                revertDuration: 250,
                helper() {
                    const helper = $(this).clone();
                    helper.css({
                        opacity: 0.5,
                        pointerEvents: "none",
                        width: $(this).width() + "px",
                        zIndex: 100001,
                    });
                    return helper;
                },
                start: (event: Event) => {
                    // Use the global state as columns can be dragged between groups
                    registry.set(
                        "pageBuilderDragColumn",
                        {
                            element: $(event.target),
                            instance: ko.dataFor($(event.target)[0]),
                        },
                    );

                    this.dropPositions = calculateDropPositions(this);
                },
                stop: () => {
                    const draggedColumn: DraggedColumn = registry.get("pageBuilderDragColumn");
                    if (this.movePosition && draggedColumn) {
                        // Check if we're moving within the same group, even though this function will
                        // only ever run on the group that bound the draggable event
                        if (draggedColumn.instance.parent === this) {
                            const currentIndex = getColumnIndexInGroup(draggedColumn.instance);
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

                    registry.remove("pageBuilderDragColumn");

                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.removeClass("active");
                },
            });
        });
    }

    /**
     * Init the resizing events on the group
     *
     * @param {JQuery<HTMLElement>} group
     */
    private initMouseMove(group: JQuery<HTMLElement>) {
        group.mousemove((event: JQuery.Event) => {
            this.handleResizingMouseMove(event, group);
            this.handleDraggingMouseMove(event, group);
            this.handleDroppingMouseMove(event, group);
        }).mouseout(() => {
            this.movePlaceholder.removeClass("active");
        }).mouseup(() => {
            this.resizing(false);
            this.resizeMouseDown = null;
            this.resizeLastColumnShrunk = null;
            this.dropPositions = [];

            this.dropPlaceholder.removeClass("left right");
            this.movePlaceholder.removeClass("active");
        });
    }

    /**
     * Handle the resizing on mouse move
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */
    private handleResizingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>) {
        let currentPos: number;
        let currentCol;

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

            let adjustedColumn;
            if (currentPos > this.resizeMouseDown) {
                // If we're increasing the width of our column we need to locate a column that can shrink to the right
                adjustedColumn = findShrinkableColumnForResize(this.resizeColumnInstance);
                if (adjustedColumn) {
                    this.resizeLastColumnShrunk = adjustedColumn;
                }
            } else {
                // Restore the width to the last column which was shrunk
                if (this.resizeLastColumnShrunk) {
                    adjustedColumn = this.resizeLastColumnShrunk;
                } else {
                    // If we're shrinking our column we can just increase the adjacent column
                    adjustedColumn = getAdjacentColumn(this.resizeColumnInstance, "+1");
                }
            }
            if (!adjustedColumn && ghostWidth > this.resizeColumnElement.width() ||
                this.resizeMaxGhostWidth
            ) {
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
            this.resizeGhost.width(ghostWidth - 2 + "px").css(
                "left",
                this.resizeColumnElement.position().left + "px",
            );

            if (!this.resizeMaxGhostWidth) {
                currentCol = this.resizeColumnWidths.find((val) => {
                    return (currentPos > (val.position - 15) && currentPos < (val.position + 15));
                });

                if (currentCol) {
                    // If we conduct a resize, record the mouse position
                    this.resizeMouseDown = currentPos;
                    resizeColumn(this.resizeColumnInstance, currentCol.width, adjustedColumn);
                }
            }
        }
    }

    /**
     * Handle a column being dragged around the group
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */
    private handleDraggingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>) {
        const dragColumn: DraggedColumn = registry.get("pageBuilderDragColumn");
        if (dragColumn) {
            // If the drop positions haven't been calculated for this group do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = calculateDropPositions(this);
            }
            const columnInstance = dragColumn.instance;
            const currentX = event.pageX - $(group).offset().left;

            // Are we within the same column group or have we ended up over another?
            if (columnInstance.parent === this) {
                const currentColumn = dragColumn.element;
                const lastColInGroup = this.children()[this.children().length - 1].element;
                const insertLastPos = lastColInGroup.position().left + (lastColInGroup.width() / 2);

                // @todo don't show placeholder next to current column
                this.movePosition = this.dropPositions.find((position, index) => {
                    // Only ever look for the left placement, except the last item where we look on the right
                    const placement = (currentX >= insertLastPos ? "right" : "left");
                    // There is 200px area over each column borders @todo calculate this
                    if (currentX > position[placement] - 100 &&
                        currentX < position[placement] + 100 &&
                        position.affectedColumn !== columnInstance && // Check affected column isn't the current column
                        position.placement === placement// Verify the position, we only check left on sorting
                    ) {
                        return position;
                    }
                });

                if (this.movePosition) {
                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        // @todo investigate why we need to -5
                        right: (this.movePosition.placement === "right" ?
                            $(group).outerWidth() - this.movePosition.right - 5 : ""
                        ),
                    }).addClass("active");
                } else {
                    this.movePlaceholder.removeClass("active");
                }
            } else {
                this.movePosition = this.dropPositions.find((position) => {
                    if (currentX > position.left && currentX < position.right && position.canShrink) {
                        return position;
                    }
                });

                if (this.movePosition) {
                    this.movePlaceholder.removeClass("active");
                    this.dropPlaceholder.removeClass("left right").css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        right: (this.movePosition.placement === "right" ?
                                $(group).width() - this.movePosition.right : ""
                        ),
                        width: $(group).width() / getMaxColumns() + "px",
                    }).addClass(this.movePosition.placement);
                } else {
                    this.dropPlaceholder.removeClass("left right");
                }
            }
        }
    }

    /**
     * Handle mouse move events on when dropping elements
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */
    private handleDroppingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>) {
        if (this.dropOverElement) {
            const currentX = event.pageX - $(group).offset().left;
            this.dropPosition = this.dropPositions.find((position) => {
                if (currentX > position.left && currentX < position.right && position.canShrink) {
                    return position;
                }
            });

            if (this.dropPosition) {
                this.dropPlaceholder.removeClass("left right").css({
                    left: (this.dropPosition.placement === "left" ? this.dropPosition.left : ""),
                    right: (this.dropPosition.placement === "right" ? $(group).width() - this.dropPosition.right : ""),
                    width: $(group).width() / getMaxColumns() + "px",
                }).addClass(this.dropPosition.placement);
            }
        }
    }

    /**
     * Init the droppable functionality for new columns
     *
     * @param {JQuery<HTMLElement>} group
     */
    private initDroppable(group: JQuery<HTMLElement>) {
        let currentDraggedBlock: InlineBlock;

        group.droppable({
            activate: (event: Event) => {
                currentDraggedBlock = ko.dataFor(event.currentTarget);
            },
            deactivate: () => {
                this.dropOverElement = null;
                this.dropPlaceholder.removeClass("left right");
            },
            drop: (event: Event, ui: JQueryUI.DroppableEventUIParam) => {
                this.handleNewColumnDrop(event, ui);
                this.handleExistingColumnDrop(event);
                this.dropPositions = [];
                this.dropPlaceholder.removeClass("left right");
            },
            greedy: true,
            out: () => {
                this.dropOverElement = null;
                this.dropPlaceholder.removeClass("left right");
            },
            over: () => {
                // Always calculate drop positions when an element is dragged over
                this.dropPositions = calculateDropPositions(this);

                // Is the element being dragged a column group?
                if (currentDraggedBlock.config.name === this.config.name) {
                    this.dropOverElement = true;
                }
            },
        });
    }

    /**
     * Handle a new column being dropped into the group
     *
     * @param {Event} event
     * @param {JQueryUI.DroppableEventUIParam} ui
     */
    private handleNewColumnDrop(event: Event, ui: JQueryUI.DroppableEventUIParam) {
        if (this.dropOverElement && this.dropPosition) {
            this.dropOverElement = null;

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
                this.dropPosition.insertIndex,
            ).then(() => {
                const newWidth = getAcceptedColumnWidth(
                    (getColumnWidth(this.dropPosition.affectedColumn) - getSmallestColumnWidth()).toString(),
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
        const column: DraggedColumn = registry.get("pageBuilderDragColumn");
        let modifyOldNeighbour;
        // This should only run when we're dragging between groups
        if (this.movePosition && column && column.instance && column.instance.parent !== this) {
            event.preventDefault();
            event.stopImmediatePropagation();

            // Determine which old neighbour we should modify
            const oldWidth = getColumnWidth(column.instance);

            // Retrieve the adjacent column either +1 or -1
            if (getAdjacentColumn(column.instance, "+1")) {
                modifyOldNeighbour = getAdjacentColumn(column.instance, "+1");
            } else if (getAdjacentColumn(column.instance, "-1")) {
                modifyOldNeighbour = getAdjacentColumn(column.instance, "-1");
            }

            // Set the column to it's smallest column width
            updateColumnWidth(column.instance, getSmallestColumnWidth());

            column.instance.parent.removeChild(column.instance);
            this.emit("blockInstanceDropped", {
                blockInstance: column.instance,
                index: this.movePosition.insertIndex,
            });

            // Modify the old neighbour
            if (modifyOldNeighbour) {
                const oldNeighbourWidth = getAcceptedColumnWidth(
                    (oldWidth + getColumnWidth(modifyOldNeighbour)).toString(),
                );
                updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
            }

            // Modify the columns new neighbour
            const newNeighbourWidth = getAcceptedColumnWidth(
                (getColumnWidth(this.movePosition.affectedColumn) - getSmallestColumnWidth()).toString(),
            );

            // Reduce the affected columns width by the smallest column width
            updateColumnWidth(this.movePosition.affectedColumn, newNeighbourWidth);
        }
    }

    /**
     * Spread any empty space across the other columns
     *
     * @param {Event} event
     * @param {BlockRemovedParams} params
     */
    private spreadWidth(event: Event, params: BlockRemovedParams) {
        const availableWidth = 100 - getColumnsWidth(this);
        const formattedAvailableWidth = getRoundedColumnWidth(availableWidth);
        const totalChildColumns = this.children().length;
        const allowedColumnWidths = [];
        let spreadAcross = 1;
        let spreadAmount;

        for (let i = getMaxColumns(); i > 0; i--) {
            allowedColumnWidths.push(getRoundedColumnWidth(100 / 6 * i));
        }

        // Determine how we can spread the empty space across the columns
        traverseChildren: for (let i = totalChildColumns; i > 0; i--) {
            const potentialWidth = formattedAvailableWidth / i;
            for (const width of allowedColumnWidths) {
                if (Math.floor(potentialWidth) === Math.floor(width)) {
                    spreadAcross = i;
                    spreadAmount = formattedAvailableWidth / i;
                    break traverseChildren;
                }
            }
        }

        // Let's spread the width across the columns
        for (let i = 1; i <= spreadAcross; i++) {
            // Let's look left
            let columnToModify: Column;

            // As the original column has been removed from the array, check the new index for a column
            if ((params.index) <= this.children().length && typeof this.children()[params.index] !== "undefined") {
                columnToModify = (this.children()[params.index] as Column);
            }
            // As far as I can tell this statement will never run, however leaving it in as it might when more columns
            // are present
            if (!columnToModify && (params.index + i) <= this.children().length &&
                typeof this.children()[params.index + i] !== "undefined"
            ) {
                columnToModify = (this.children()[params.index + i] as Column);
            }
            if (!columnToModify && (params.index - i) >= 0 &&
                typeof this.children()[params.index - i] !== "undefined"
            ) {
                columnToModify = (this.children()[params.index - i] as Column);
            }
            if (columnToModify) {
                updateColumnWidth(columnToModify, getColumnWidth(columnToModify) + spreadAmount);
            }
        }
    }

    /**
     * Remove self if we contain no children
     */
    private removeIfEmpty() {
        if (this.children().length === 0) {
            this.parent.removeChild(this);
            return;
        }
    }
}

interface BlockRemovedParams {
    block: Column;
    index: number;
}

interface DraggedColumn {
    instance: Column;
    element: JQuery<HTMLElement>;
}
