/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
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
    calculateDropPositions, ColumnWidth, createColumn, determineColumnWidths, determineMaxGhostWidth,
    DropPosition, findShrinkableColumn,
    findShrinkableColumnForResize,
    getAcceptedColumnWidth, getAdjacentColumn, getColumnIndexInGroup, getColumnsWidth, getColumnWidth,
    getMaxColumns, getRoundedColumnWidth, getSmallestColumnWidth, MaxGhostWidth, resizeColumn, updateColumnWidth,
} from "./column/utils";
import InlineBlock from "./inline";

export default class ColumnGroup extends Block {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    private dropPlaceholder: JQuery<HTMLElement>;
    private movePlaceholder: JQuery<HTMLElement>;
    private groupElement: JQuery<HTMLElement>;

    private resizeGhost: JQuery<HTMLElement>;
    private resizeColumnInstance: Column;
    private resizeColumnWidths: ColumnWidth[] = [];
    private resizeMaxGhostWidth: MaxGhostWidth;
    private resizeMouseDown: boolean;
    private resizeLeftLastColumnShrunk: Column;
    private resizeRightLastColumnShrunk: Column;
    private resizeLastPosition: number;
    private resizeHistory: ResizeHistory = {
        left: [],
        right: [],
    };

    private dropOverElement: boolean;
    private dropPositions: DropPosition[] = [];
    private dropPosition: DropPosition;
    private movePosition: DropPosition;

    private debounceBindDraggable = _.debounce(
        () => this.bindDraggable(),
        150,
    );


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
    public bindInteractions(group: Element) {
        this.groupElement = $(group);
        this.initDroppable(this.groupElement);
        this.initMouseMove(this.groupElement);

        // We have to re-bind the draggable library to any new children that appear inside the group
        this.children.subscribe(this.debounceBindDraggable.bind(this));
        this.debounceBindDraggable();
    }

    /**
     * Init the drop placeholder
     *
     * @param element
     */
    public bindDropPlaceholder(element: Element) {
        this.dropPlaceholder = $(element);
    }

    /**
     * Init the move placeholder
     *
     * @param {Element} element
     */
    public bindMovePlaceholder(element: Element) {
        this.movePlaceholder = $(element);
    }

    /**
     * Retrieve the ghost element from the template
     *
     * @param {Element} ghost
     */
    public bindGhost(ghost: Element) {
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
            this.resizeColumnWidths = determineColumnWidths(this.resizeColumnInstance, this.groupElement);
            this.resizeMaxGhostWidth = determineMaxGhostWidth(this.resizeColumnWidths);

            // Set a flag of the columns which are currently being resized
            this.setColumnsAsResizing(column, getAdjacentColumn(column, "+1"));

            // Force the cursor to resizing
            $("body").css("cursor", "col-resize");

            // Reset the resize history
            this.resizeHistory = {
                left: [],
                right: [],
            };

            this.resizeLastPosition = null;
            this.resizeMouseDown = true;
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
        let duplicate;
        // Attempt to split the current column into parts
        let splitTimes = Math.round(getColumnWidth(child) / getSmallestColumnWidth());
        if (splitTimes > 1) {
            duplicate = super.duplicateChild(child, autoAppend) as Column;
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
        } else {
            // Conduct an outward search on the children to locate a suitable shrinkable column
            const shrinkableColumn = findShrinkableColumn(child);
            if (shrinkableColumn) {
                duplicate = super.duplicateChild(child, autoAppend) as Column;
                updateColumnWidth(
                    shrinkableColumn,
                    getAcceptedColumnWidth(
                        (getColumnWidth(shrinkableColumn) - getSmallestColumnWidth()).toString(),
                    ),
                );
                updateColumnWidth(duplicate, getSmallestColumnWidth());
            }
        }

        // If we aren't able to duplicate inform the user why
        if (!duplicate) {
            this.stage.parent.alertDialog({
                content: $t("There is no free space within the column group to perform this action."),
                title: $t("Unable to duplicate column"),
            });
        }
    }

    /**
     * Set columns in the group as resizing
     *
     * @param {Column} columns
     */
    private setColumnsAsResizing(...columns: Column[]) {
        columns.forEach((column) => {
            column.resizing(true);
        });
    }

    /**
     * Unset resizing flag on all child columns
     */
    private unsetResizingColumns() {
        this.children().forEach((column: Column) => {
            column.resizing(false);
        });
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
                containment: "body",
                handle: ".move-column",
                revertDuration: 250,
                helper() {
                    const helper = $(this).clone();
                    helper.css({
                        opacity: 0.5,
                        pointerEvents: "none",
                        width: $(this).width() + "px",
                        zIndex: 100,
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
        }).mouseleave(() => {
            this.movePlaceholder.css("left", "").removeClass("active");
        }).mouseup(() => {
            this.resizing(false);
            this.resizeMouseDown = null;
            this.resizeLeftLastColumnShrunk = this.resizeRightLastColumnShrunk = null;
            this.dropPositions = [];

            this.unsetResizingColumns();

            // Change the cursor back
            $("body").css("cursor", "");

            this.dropPlaceholder.removeClass("left right");
            this.movePlaceholder.removeClass("active");
            this.resizeGhost.removeClass("active");
        });
    }

    /**
     * Determine which column should be adjusted in this resizing action
     *
     * @param {JQuery<HTMLElement>} group
     * @param {number} currentPos
     * @param {Column} column
     * @param {ResizeHistory} history
     * @returns {[Column , string , string]}
     */
    private determineAdjustedColumn(
        group: JQuery<HTMLElement>,
        currentPos: number,
        column: Column,
        history: ResizeHistory,
    ): [Column, string, string] {
        let modifyColumnInPair: string = "left";
        let usedHistory: string;
        const resizeColumnLeft = column.element.offset().left;
        const resizeColumnWidth = column.element.outerWidth();
        const resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;

        let adjustedColumn: Column;
        if (currentPos >= resizeHandlePosition) {
            // Get the history for the opposite direction of resizing
            if (history.left.length > 0) {
                usedHistory = "left";
                adjustedColumn = history.left.reverse()[0].adjustedColumn;
                modifyColumnInPair = history.left.reverse()[0].modifyColumnInPair;
            } else {
                // If we're increasing the width of our column we need to locate a column that can shrink to the
                // right
                adjustedColumn = findShrinkableColumnForResize(column, "right");
            }
        } else {
            if (history.right.length > 0) {
                usedHistory = "right";
                adjustedColumn = history.right.reverse()[0].adjustedColumn;
                modifyColumnInPair = history.right.reverse()[0].modifyColumnInPair;
            } else {
                // Detect if we're increasing the side of the right column, and we've hit the smallest limit on the
                // current element
                if (getColumnWidth(column) <= getSmallestColumnWidth()) {
                    adjustedColumn = findShrinkableColumnForResize(column, "left");
                    if (adjustedColumn) {
                        modifyColumnInPair = "right";
                    }
                } else {
                    // If we're shrinking our column we can just increase the adjacent column
                    adjustedColumn = getAdjacentColumn(column, "+1");
                }
            }
        }

        return [adjustedColumn, modifyColumnInPair, usedHistory];
    }

    /**
     * Calculate the size of the resize ghost
     *
     * @param {JQuery<HTMLElement>} group
     * @param {number} currentPos
     * @param {Column} column
     * @param {Column} adjustedColumn
     * @param {string} modifyColumnInPair
     * @param {number} maxGhostWidth
     * @returns {[number , number]}
     */
    private calculateResizeGhostWidth(
        group: JQuery<HTMLElement>,
        currentPos: number,
        column: Column,
        adjustedColumn: Column,
        modifyColumnInPair: string,
        maxGhostWidth: MaxGhostWidth,
    ): number {
        let ghostWidth = currentPos - group.offset().left;

        switch (modifyColumnInPair) {
            case "left":
                const singleColumnWidth = column.element.position().left + group.width() / getMaxColumns();
                // Don't allow the ghost widths be less than the smallest column
                if (ghostWidth <= singleColumnWidth) {
                    ghostWidth = singleColumnWidth;
                }

                if (currentPos >= maxGhostWidth.left) {
                    ghostWidth = maxGhostWidth.left - group.offset().left;
                }
                break;
            case "right":
                if (currentPos <= maxGhostWidth.right) {
                    ghostWidth = maxGhostWidth.right - group.offset().left;
                }
                break;
        }

        return ghostWidth;
    }

    /**
     * Record the resizing history for this action
     *
     * @param {string} usedHistory
     * @param {string} direction
     * @param {Column} adjustedColumn
     * @param {string} modifyColumnInPair
     */
    private recordResizeHistory(
        usedHistory: string,
        direction: string,
        adjustedColumn: Column,
        modifyColumnInPair: string,
    ) {
        if (usedHistory) {
            this.resizeHistory[usedHistory].pop();
        }
        this.resizeHistory[direction].push({
            adjustedColumn,
            modifyColumnInPair,
        });
    }

    /**
     * Handle the resizing on mouse move, we always resize a pair of columns at once
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */
    private handleResizingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>) {
        let currentCol: ColumnWidth;

        if (this.resizeMouseDown) {
            event.preventDefault();
            const currentPos = event.pageX;
            const resizeColumnLeft = this.resizeColumnInstance.element.offset().left;
            const resizeColumnWidth = this.resizeColumnInstance.element.outerWidth();
            const resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;
            const direction = (currentPos >= resizeHandlePosition) ? "right" : "left";

            let adjustedColumn: Column;
            let modifyColumnInPair: string; // We need to know if we're modifying the left or right column in the pair
            let usedHistory: string; // Was the adjusted column pulled from history?

            // Determine which column in the group should be adjusted for this action
            [adjustedColumn, modifyColumnInPair, usedHistory] = this.determineAdjustedColumn(
                group,
                currentPos,
                this.resizeColumnInstance,
                this.resizeHistory,
            );

            // Calculate the ghost width based on mouse position and bounds of allowed sizes
            const ghostWidth = this.calculateResizeGhostWidth(
                group,
                currentPos,
                this.resizeColumnInstance,
                adjustedColumn,
                modifyColumnInPair,
                this.resizeMaxGhostWidth,
            );

            this.resizeGhost.width(ghostWidth - 15 + "px").addClass("active");

            if (adjustedColumn && this.resizeColumnWidths) {
                currentCol = this.resizeColumnWidths.find((val) => {
                    return (currentPos > (val.position - 35) && currentPos < (val.position + 35)) &&
                        val.forColumn === modifyColumnInPair;
                });

                if (currentCol) {
                    let mainColumn = this.resizeColumnInstance;
                    // If we're using the left data set, we're actually resizing the right column of the group
                    if (modifyColumnInPair === "right") {
                        mainColumn = getAdjacentColumn(this.resizeColumnInstance, "+1");
                    }

                    // Ensure we aren't resizing multiple times, also validate the last resize isn't the same as the
                    // one being performed now. This occurs as we re-calculate the column positions on resize
                    if (getColumnWidth(mainColumn) !== currentCol.width &&
                        this.resizeLastPosition !== currentCol.position
                    ) {
                        this.recordResizeHistory(
                            usedHistory,
                            direction,
                            adjustedColumn,
                            modifyColumnInPair,
                        );
                        this.resizeLastPosition = currentCol.position;

                        resizeColumn(mainColumn, currentCol.width, adjustedColumn);

                        // Wait for the render cycle to finish from the above resize before re-calculating
                        _.defer(() => {
                            // If we do a resize, re-calculate the column widths
                            this.resizeColumnWidths = determineColumnWidths(
                                this.resizeColumnInstance,
                                this.groupElement,
                            );
                            this.resizeMaxGhostWidth = determineMaxGhostWidth(this.resizeColumnWidths);
                        });
                    }
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
                const currentColumnRight = currentColumn.position().left + currentColumn.width();
                const lastColInGroup = this.children()[this.children().length - 1].element;
                const insertLastPos = lastColInGroup.position().left + (lastColInGroup.width() / 2);

                this.movePosition = this.dropPositions.find((position) => {
                    // Only ever look for the left placement, except the last item where we look on the right
                    const placement = (currentX >= insertLastPos ? "right" : "left");
                    // There is 200px area over each column borders
                    return (currentX > position[placement] - 100 &&
                        currentX < position[placement] + 100 &&
                        // Verify we're not dropping next to the current columns right position
                        !(currentX > currentColumnRight - 100 && currentX < currentColumnRight + 100) &&
                        position.affectedColumn !== columnInstance && // Check affected column isn't the current column
                        position.placement === placement// Verify the position, we only check left on sorting
                    );
                });

                if (this.movePosition) {
                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        right: (this.movePosition.placement === "right" ?
                            $(group).outerWidth() - this.movePosition.right - 5 : ""
                        ),
                    }).addClass("active");
                } else {
                    this.movePlaceholder.removeClass("active");
                }
            } else {
                // If we're moving to another column group we utilise the existing drop placeholder
                this.movePosition = this.dropPositions.find((position) => {
                    return currentX > position.left && currentX < position.right && position.canShrink;
                });

                if (this.movePosition) {
                    const classToRemove = (this.movePosition.placement === "left" ? "right" : "left");
                    this.movePlaceholder.removeClass("active");
                    this.dropPlaceholder.removeClass(classToRemove).css({
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
                return currentX > position.left && currentX < position.right && position.canShrink;
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
                // Delay the removal of the flag so other systems have time to execute
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
        if (this.children().length === 0) {
            return;
        }

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
            let columnToModify: Column;

            // As the original column has been removed from the array, check the new index for a column
            if ((params.index) <= this.children().length && typeof this.children()[params.index] !== "undefined") {
                columnToModify = (this.children()[params.index] as Column);
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

interface ResizeHistory {
    left: ResizeHistoryItem[];
    right: ResizeHistoryItem[];
    [key: string]: ResizeHistoryItem[];
}

interface ResizeHistoryItem {
    adjustedColumn: Column;
    modifyColumnInPair: string;
}

interface BlockRemovedParams {
    block: Column;
    index: number;
}

interface DraggedColumn {
    instance: Column;
    element: JQuery<HTMLElement>;
}
