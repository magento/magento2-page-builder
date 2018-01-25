/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import ko from "knockout";
import _ from "underscore";
import Config from "../../config";
import {Block as GroupBlock} from "../../stage/panel/group/block";
import Column from "../column";
import {default as ColumnGroupBlock} from "../column-group";
import PreviewBlock from "./block";
import {calculateDropPositions, DropPosition} from "./column-group/dragdrop";
import {getDragColumn, removeDragColumn, setDragColumn} from "./column-group/registry";
import {
    calculateGhostWidth,
    ColumnWidth, determineAdjustedColumn, determineColumnWidths, determineMaxGhostWidth, getAdjacentColumn,
    getColumnWidth, getMaxColumns, MaxGhostWidth,
    ResizeHistory,
} from "./column-group/resizing";

export default class ColumnGroup extends PreviewBlock {
    public parent: ColumnGroupBlock;
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

    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: ColumnGroupBlock, config: object) {
        super(parent, config);
        this.parent = parent;
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
        this.parent.children.subscribe(this.debounceBindDraggable.bind(this));
        this.debounceBindDraggable();

        // Listen for resizing events from child columns
        this.parent.children.subscribe((newColumns: Column[]) => {
            newColumns.forEach((column) => {
                column.on("initResizing", (event: Event, params: {handle: JQuery<HTMLElement>}) => {
                    this.registerResizeHandle(column, params.handle);
                });
            });
        });

        // Handle the mouse leaving the window
        $("body").mouseleave(this.endAllInteractions.bind(this));
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
     * Register a resize handle within a child column
     *
     * @param {Column} column
     * @param {JQuery<HTMLElement>} handle
     */
    public registerResizeHandle(column: Column, handle: JQuery<HTMLElement>) {
        handle.off("mousedown");
        handle.on("mousedown",(event) => {
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
        this.parent.children().forEach((column: Column) => {
            column.resizing(false);
        });
    }

    /**
     * Bind draggable instances to the child columns
     */
    private bindDraggable() {
        this.parent.children().forEach((column: Column) => {
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
                    setDragColumn(ko.dataFor($(event.target)[0]) as Column);
                    this.dropPositions = calculateDropPositions(this.parent);
                },
                stop: () => {
                    const draggedColumn: Column = getDragColumn();
                    if (this.movePosition && draggedColumn) {
                        // Check if we're moving within the same group, even though this function will
                        // only ever run on the group that bound the draggable event
                        if (draggedColumn.parent === this.parent) {
                            this.parent.handleColumnSort(draggedColumn, this.movePosition.insertIndex);
                            this.movePosition = null;
                        }
                    }

                    removeDragColumn();

                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.removeClass("active");
                },
            });
        });
    }

    /**
     * End all current interactions
     */
    private endAllInteractions() {
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
            this.endAllInteractions();
        });
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
            [adjustedColumn, modifyColumnInPair, usedHistory] = determineAdjustedColumn(
                group,
                currentPos,
                this.resizeColumnInstance,
                this.resizeHistory,
            );

            // Calculate the ghost width based on mouse position and bounds of allowed sizes
            const ghostWidth = calculateGhostWidth(
                group,
                currentPos,
                this.resizeColumnInstance,
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

                        this.parent.handleColumnResize(mainColumn, currentCol.width, adjustedColumn);

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
        const dragColumn: Column = getDragColumn();
        if (dragColumn) {
            // If the drop positions haven't been calculated for this group do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = calculateDropPositions(this.parent);
            }
            const columnInstance = dragColumn;
            const currentX = event.pageX - $(group).offset().left;

            // Are we within the same column group or have we ended up over another?
            if (columnInstance.parent === this.parent) {
                const currentColumn = dragColumn.element;
                const currentColumnRight = currentColumn.position().left + currentColumn.width();
                const lastColInGroup = this.parent.children()[this.parent.children().length - 1].element;
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
        let currentDraggedBlock: GroupBlock;

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
                if (this.dropOverElement && this.dropPosition) {
                    this.parent.handleNewColumnDrop(event, ui, this.dropPosition);
                    this.dropOverElement = null;
                }

                const column: Column = getDragColumn();
                if (this.movePosition && column && column.parent !== this.parent) {
                    this.parent.handleExistingColumnDrop(event, this.movePosition);
                }

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
                this.dropPositions = calculateDropPositions(this.parent);

                // Is the element currently being dragged a column?
                if (currentDraggedBlock instanceof GroupBlock &&
                    currentDraggedBlock.getConfig() === Config.getContentTypeConfig("column")
                ) {
                    this.dropOverElement = true;
                }
            },
        });
    }
}
