/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "uiEvents";
import _ from "underscore";
import Config from "../../config";
import ColumnGroup from "../../content-type-collection";
import ContentTypeCollectionInterface from "../../content-type-collection.d";
import ContentTypeConfigInterface from "../../content-type-config.d";
import {DataObject} from "../../data-store";
import {animationTime} from "../../drag-drop/container-animation";
import {moveContentType} from "../../drag-drop/move-content-type";
import {getDraggedContentTypeConfig} from "../../drag-drop/registry";
import {createStyleSheet} from "../../utils/create-stylesheet";
import {default as ColumnGroupPreview} from "../column-group/preview";
import ColumnPreview from "../column/preview";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";
import {calculateDropPositions, DropPosition} from "./drag-and-drop";
import {createColumn} from "./factory";
import {GridSizeError, resizeGrid} from "./grid-size";
import {getDragColumn, removeDragColumn, setDragColumn} from "./registry";
import ResizeUtils from "./resize";

interface ContentTypeRemovedParams {
    parent: ColumnGroup;
    contentType: ContentTypeCollectionInterface;
    index: number;
}

export default class Preview extends PreviewCollection {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    public hasEmptyChild: KnockoutComputed<boolean> = ko.computed(() => {
        let empty: boolean = false;
        (this.parent as ColumnGroup).getChildren()()
            .forEach((column: ColumnGroup) => {
                if (column.getChildren()().length === 0) {
                    empty = true;
                }
            });
        return empty;
    });
    public gridSize: KnockoutObservable<number> = ko.observable();
    public gridSizeArray: KnockoutObservableArray<any[]> = ko.observableArray([]);
    public gridSizeError: KnockoutObservable<string> = ko.observable();
    private dropPlaceholder: JQuery<HTMLElement>;
    private movePlaceholder: JQuery<HTMLElement>;
    private groupElement: JQuery<HTMLElement>;
    private resizeGhost: JQuery<HTMLElement>;
    private resizeColumnInstance: ContentTypeCollectionInterface<ColumnPreview>;
    private resizeColumnWidths: ColumnWidth[] = [];
    private resizeMaxGhostWidth: MaxGhostWidth;
    private resizeMouseDown: boolean;
    private resizeLeftLastColumnShrunk: ContentTypeCollectionInterface<ColumnPreview>;
    private resizeRightLastColumnShrunk: ContentTypeCollectionInterface<ColumnPreview>;
    private resizeLastPosition: number;
    private resizeLastColumnInPair: string;
    private resizeHistory: ResizeHistory = {
        left: [],
        right: [],
    };
    private dropOverElement: boolean;
    private dropPositions: DropPosition[] = [];
    private dropPosition: DropPosition;
    private movePosition: DropPosition;
    private groupPositionCache: GroupPositionCache;
    private resizeUtils: ResizeUtils;

    /**
     *
     * @param {ContentTypeCollection} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ColumnGroup,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);
        this.resizeUtils = new ResizeUtils(this.parent);

        // Keep track of the grid size in an observable
        this.parent.dataStore.subscribe((state: DataObject) => {
            const gridSize = parseInt(state.gridSize.toString(), 10);
            this.gridSize(gridSize);
            this.gridSizeArray(new Array(gridSize));
        }, "gridSize");

        events.on("contentType:removed", (args: ContentTypeRemovedParams) => {
            if (args.parent.id === this.parent.id) {
                this.spreadWidth(event, args);
            }
        });

        // Listen for resizing events from child columns
        events.on("column:bindResizeHandle", (args: any) => {
            // Does the events parent match the previews parent? (e.g. column group)
            if (args.parent.id === this.parent.id) {
                (this as ColumnGroupPreview).registerResizeHandle(args.column, args.handle);
            }
        });
        events.on("column:initElement", (args: any) => {
            // Does the events parent match the previews parent? (e.g. column group)
            if (args.parent.id === this.parent.id) {
                (this as ColumnGroupPreview).bindDraggable(args.column);
            }
        });

        this.parent.children.subscribe(
            _.debounce(
                this.removeIfEmpty.bind(this),
                50,
            ),
        );
    }

    /**
     * Retrieve the resize utils
     *
     * @returns {ResizeUtils}
     */
    public getResizeUtils(): ResizeUtils {
        return this.resizeUtils;
    }

    /**
     * Update the grid size on enter or blur of the input
     *
     * @param {Preview} context
     * @param {KeyboardEvent & Event} event
     */
    public updateGridSize(context: Preview, event: KeyboardEvent & Event) {
        if ((event.type === "keydown" && event.which === 13 || event.keyCode === 13) || event.type === "blur") {
            const newGridSize = parseInt($(event.target).val().toString(), 10);
            if (newGridSize) {
                try {
                    resizeGrid((this.parent as ContentTypeCollectionInterface<Preview>), newGridSize);
                    this.gridSizeError("");
                } catch (e) {
                    if (e instanceof GridSizeError) {
                        this.gridSizeError(e.message);
                    } else {
                        throw e;
                    }
                }
            }
        }
    }

    /**
     * Handle a new column being dropped into the group
     *
     * @param {DropPosition} dropPosition
     */
    public onNewColumnDrop(dropPosition: DropPosition) {
        // Create our new column
        createColumn(
            this.parent,
            this.resizeUtils.getSmallestColumnWidth(),
            dropPosition.insertIndex,
        ).then(() => {
            const newWidth = this.resizeUtils.getAcceptedColumnWidth(
                (this.resizeUtils.getColumnWidth(dropPosition.affectedColumn) -
                    this.resizeUtils.getSmallestColumnWidth()).toString(),
            );

            // Reduce the affected columns width by the smallest column width
            this.resizeUtils.updateColumnWidth(dropPosition.affectedColumn, newWidth);
        });
    }

    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {DropPosition} movePosition
     */
    public onExistingColumnDrop(movePosition: DropPosition) {
        const column = getDragColumn();
        let modifyOldNeighbour;

        // Determine which old neighbour we should modify
        const oldWidth = this.resizeUtils.getColumnWidth(column);

        // Retrieve the adjacent column either +1 or -1
        if (this.resizeUtils.getAdjacentColumn(column, "+1")) {
            modifyOldNeighbour = this.resizeUtils.getAdjacentColumn(column, "+1");
        } else if (this.resizeUtils.getAdjacentColumn(column, "-1")) {
            modifyOldNeighbour = this.resizeUtils.getAdjacentColumn(column, "-1");
        }

        // Set the column to it's smallest column width
        this.resizeUtils.updateColumnWidth(column, this.resizeUtils.getSmallestColumnWidth());

        // Move the content type
        moveContentType(column, movePosition.insertIndex, this.parent);

        // Modify the old neighbour
        if (modifyOldNeighbour) {
            const oldNeighbourWidth = this.resizeUtils.getAcceptedColumnWidth(
                (oldWidth + this.resizeUtils.getColumnWidth(modifyOldNeighbour)).toString(),
            );
            this.resizeUtils.updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
        }

        // Modify the columns new neighbour
        const newNeighbourWidth = this.resizeUtils.getAcceptedColumnWidth(
            (this.resizeUtils.getColumnWidth(movePosition.affectedColumn) -
                this.resizeUtils.getSmallestColumnWidth()).toString(),
        );

        // Reduce the affected columns width by the smallest column width
        this.resizeUtils.updateColumnWidth(movePosition.affectedColumn, newNeighbourWidth);
    }

    /**
     * Handle a column being sorted into a new position in the group
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} newIndex
     */
    public onColumnSort(column: ContentTypeCollectionInterface<ColumnPreview>, newIndex: number) {
        const currentIndex = this.resizeUtils.getColumnIndexInGroup(column);
        if (currentIndex !== newIndex) {
            if (currentIndex < newIndex) {
                // As we're moving an array item the keys all reduce by 1
                --newIndex;
            }

            // Move the content type
            moveContentType(column, newIndex);
        }
    }

    /**
     * Handle a column being resized
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} width
     * @param {ContentTypeCollectionInterface<ColumnPreview>} adjustedColumn
     */
    public onColumnResize(
        column: ContentTypeCollectionInterface<ColumnPreview>,
        width: number,
        adjustedColumn: ContentTypeCollectionInterface<ColumnPreview>,
    ) {
        this.resizeUtils.resizeColumn(column, width, adjustedColumn);
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

        // Handle the mouse leaving the window
        $("body").mouseleave(this.endAllInteractions.bind(this));
    }

    /**
     * Init the drop placeholder
     *
     * @param {Element} element
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
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {JQuery<HTMLElement>} handle
     */
    public registerResizeHandle(column: ContentTypeCollectionInterface<ColumnPreview>, handle: JQuery<HTMLElement>) {
        handle.off("mousedown touchstart");
        handle.on("mousedown touchstart", (event) => {
            event.preventDefault();
            const groupPosition = this.getGroupPosition(this.groupElement);
            this.resizing(true);

            this.resizeColumnInstance = column;
            this.resizeColumnWidths = this.resizeUtils.determineColumnWidths(
                this.resizeColumnInstance,
                groupPosition,
            );
            this.resizeMaxGhostWidth = this.resizeUtils.determineMaxGhostWidth(this.resizeColumnWidths);

            // Set a flag of the columns which are currently being resized
            this.setColumnsAsResizing(column, this.resizeUtils.getAdjacentColumn(column, "+1"));

            // Force the cursor to resizing
            $("body").css("cursor", "col-resize");

            // Reset the resize history
            this.resizeHistory = {
                left: [],
                right: [],
            };

            this.resizeLastPosition = null;
            this.resizeMouseDown = true;

            events.trigger("interaction:start", {stageId: this.parent.stageId});
        });
    }

    /**
     * Bind draggable instances to the child columns
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @returns {JQuery<TElement extends Node>}
     */
    public bindDraggable(column: ContentTypeCollectionInterface<ColumnPreview>) {
        column.preview.element.draggable({
            appendTo: "body",
            containment: "body",
            handle: ".move-column",
            revertDuration: 250,
            helper() {
                const helper = $(this).clone();
                helper.css({
                    height: $(this).outerHeight() + "px",
                    minHeight: 0,
                    opacity: 0.5,
                    pointerEvents: "none",
                    width: $(this).outerWidth() + "px",
                    zIndex: 100,
                });
                return helper;
            },
            start: (event: Event) => {
                const columnInstance: ContentTypeCollectionInterface = ko.dataFor($(event.target)[0]);
                // Use the global state as columns can be dragged between groups
                setDragColumn((columnInstance.parent as ContentTypeCollectionInterface<ColumnPreview>));
                this.dropPositions = calculateDropPositions(this.parent);

                events.trigger("column:drag:start", {
                    column: columnInstance,
                    stageId: this.parent.stageId,
                });
                events.trigger("interaction:start", {stageId: this.parent.stageId});
            },
            stop: () => {
                const draggedColumn = getDragColumn();
                if (this.movePosition && draggedColumn) {
                    // Check if we're moving within the same group, even though this function will
                    // only ever run on the group that bound the draggable event
                    if (draggedColumn.parent === this.parent) {
                        this.onColumnSort(draggedColumn, this.movePosition.insertIndex);
                        this.movePosition = null;
                    }
                }

                removeDragColumn();

                this.dropPlaceholder.removeClass("left right");
                this.movePlaceholder.removeClass("active");

                events.trigger("column:drag:stop", {
                    column: draggedColumn,
                    stageId: this.parent.stageId,
                });
                events.trigger("interaction:stop", {stageId: this.parent.stageId});
            },
        });
    }

    /**
     * Hide grid size panel on focus out
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onFocusOut(context: Preview, event: Event): void {
        const target = $(`.${(event.currentTarget as HTMLElement).className}`)
            .closest(".pagebuilder-grid-panel");
        target.removeClass("pagebuilder-grid-panel-visible");
        events.trigger("interaction:stop");
    }

    /**
     * Show grid size panel on click and start interaction
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onGridClick(context: Preview, event: Event): void {
        const target = $("." + (event.currentTarget as HTMLElement).className)
            .find(".pagebuilder-grid-panel");
        target.addClass("pagebuilder-grid-panel-visible");
        _.delay(() => {
            target.find(".admin__control-text").focus();
            events.trigger("interaction:start");
        }, 100); // 100 ms delay to allow for grid panel to render
    }

    /**
     * Set columns in the group as resizing
     *
     * @param {ContentTypeCollectionInterface} columns
     */
    private setColumnsAsResizing(...columns: Array<ContentTypeCollectionInterface<ColumnPreview>>) {
        columns.forEach((column) => {
            column.preview.resizing(true);
            column.preview.element.css({transition: `width ${animationTime}ms ease-in-out`});
        });
    }

    /**
     * Unset resizing flag on all child columns
     */
    private unsetResizingColumns() {
        this.parent.children().forEach((column: ContentTypeCollectionInterface<ColumnPreview>) => {
            (column.preview as ColumnPreview).resizing(false);
            if (column.preview.element) {
                column.preview.element.css({transition: ""});
            }
        });
    }

    /**
     * End all current interactions
     */
    private endAllInteractions() {
        if (this.resizing() === true) {
            events.trigger("interaction:stop", {stageId: this.parent.stageId});
        }

        this.resizing(false);
        this.resizeMouseDown = null;
        this.resizeLeftLastColumnShrunk = this.resizeRightLastColumnShrunk = null;
        this.dropPositions = [];

        this.unsetResizingColumns();

        // Change the cursor back
        $("body").css("cursor", "");

        this.dropPlaceholder.removeClass("left right");
        this.movePlaceholder.css("left", "").removeClass("active");
        this.resizeGhost.removeClass("active");

        // Reset the group positions cache
        this.groupPositionCache = null;
    }

    /**
     * Init the resizing events on the group
     *
     * @param {JQuery<HTMLElement>} group
     */
    private initMouseMove(group: JQuery<HTMLElement>) {
        let intersects: boolean = false;
        $(document).on("mousemove touchmove", (event: JQuery.Event) => {
            const groupPosition = this.getGroupPosition(group);

            // If we're handling a touch event we need to pass through the page X & Y
            if (event.type === "touchmove") {
                event.pageX = (event.originalEvent as any).pageX;
                event.pageY = (event.originalEvent as any).pageY;
            }

            if (this.eventIntersectsGroup(event, groupPosition)) {
                intersects = true;
                this.onResizingMouseMove(event, group, groupPosition);
                this.onDraggingMouseMove(event, group, groupPosition);
                this.onDroppingMouseMove(event, group, groupPosition);
            } else {
                intersects = false;
                this.groupPositionCache = null;
                this.dropPosition = null;
                this.dropPlaceholder.removeClass("left right");
                this.movePlaceholder.css("left", "").removeClass("active");
            }
        }).on("mouseup touchend", () => {
            if (intersects) {
                this.handleMouseUp();
            }
            intersects = false;

            this.dropPosition = null;
            this.endAllInteractions();

            _.defer(() => {
                // Re-enable any disabled sortable areas
                group.find(".ui-sortable").each(function() {
                    if ($(this).data("sortable")) {
                        $(this).sortable("option", "disabled", false);
                    }
                });
            });
        });
    }

    /**
     * Handle the mouse up action, either adding a new column or moving an existing
     */
    private handleMouseUp() {
        if (this.dropOverElement && this.dropPosition) {
            this.onNewColumnDrop(this.dropPosition);
            this.dropOverElement = null;
        }

        const column = getDragColumn();

        if (this.movePosition && column && column.parent !== this.parent) {
            this.onExistingColumnDrop(this.movePosition);
        }
    }

    /**
     * Does the current event intersect with the group?
     *
     * @param {JQuery.Event} event
     * @param {GroupPositionCache} groupPosition
     * @returns {boolean}
     */
    private eventIntersectsGroup(event: JQuery.Event, groupPosition: GroupPositionCache) {
        return event.pageY > groupPosition.top &&
            event.pageY < (groupPosition.top + groupPosition.outerHeight) &&
            event.pageX > groupPosition.left &&
            event.pageX < (groupPosition.left + groupPosition.outerWidth);
    }

    /**
     * Cache the groups positions
     *
     * @param {JQuery<HTMLElement>} group
     */
    private getGroupPosition(group: JQuery<HTMLElement>) {
        if (!this.groupPositionCache) {
            this.groupPositionCache = {
                top: group.offset().top,
                left: group.offset().left,
                width: group.width(),
                height: group.height(),
                outerWidth: group.outerWidth(),
                outerHeight: group.outerHeight(),
            };
        }

        return this.groupPositionCache;
    }

    /**
     * Record the resizing history for this action
     *
     * @param {string} usedHistory
     * @param {string} direction
     * @param {ContentTypeCollectionInterface<ColumnPreview>} adjustedColumn
     * @param {string} modifyColumnInPair
     */
    private recordResizeHistory(
        usedHistory: string,
        direction: string,
        adjustedColumn: ContentTypeCollectionInterface<ColumnPreview>,
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
     * @param {GroupPositionCache} groupPosition
     */
    private onResizingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>, groupPosition: GroupPositionCache) {
        let newColumnWidth: ColumnWidth;

        if (this.resizeMouseDown) {
            event.preventDefault();
            const currentPos = event.pageX;
            const resizeColumnLeft = this.resizeColumnInstance.preview.element.offset().left;
            const resizeColumnWidth = this.resizeColumnInstance.preview.element.outerWidth();
            const resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;
            const direction = (currentPos >= resizeHandlePosition) ? "right" : "left";

            let adjustedColumn: ContentTypeCollectionInterface<ColumnPreview>;
            let modifyColumnInPair: string; // We need to know if we're modifying the left or right column in the pair
            let usedHistory: string; // Was the adjusted column pulled from history?

            // Determine which column in the group should be adjusted for this action
            [adjustedColumn, modifyColumnInPair, usedHistory] = this.resizeUtils.determineAdjustedColumn(
                currentPos,
                this.resizeColumnInstance,
                this.resizeHistory,
            );

            // Calculate the ghost width based on mouse position and bounds of allowed sizes
            const ghostWidth = this.resizeUtils.calculateGhostWidth(
                groupPosition,
                currentPos,
                this.resizeColumnInstance,
                modifyColumnInPair,
                this.resizeMaxGhostWidth,
            );

            this.resizeGhost.width(ghostWidth - 15 + "px").addClass("active");

            if (adjustedColumn && this.resizeColumnWidths) {
                newColumnWidth = this.resizeColumnWidths.find((val) => {
                    return this.resizeUtils.comparator(currentPos, val.position, 35)
                        && val.forColumn === modifyColumnInPair;
                });

                if (newColumnWidth) {
                    let mainColumn = this.resizeColumnInstance;
                    // If we're using the left data set, we're actually resizing the right column of the group
                    if (modifyColumnInPair === "right") {
                        mainColumn = this.resizeUtils.getAdjacentColumn(this.resizeColumnInstance, "+1");
                    }

                    // Ensure we aren't resizing multiple times, also validate the last resize isn't the same as the
                    // one being performed now. This occurs as we re-calculate the column positions on resize, we have
                    // to use the comparator as the calculation may result in slightly different numbers due to rounding
                    if (this.resizeUtils.getColumnWidth(mainColumn) !== newColumnWidth.width &&
                        !this.resizeUtils.comparator(this.resizeLastPosition, newColumnWidth.position, 10)
                    ) {
                        // If our previous action was to resize the right column in pair, and we're now dragging back
                        // to the right, but have matched a column for the left we need to fix the columns being
                        // affected
                        if (usedHistory && this.resizeLastColumnInPair === "right" && direction === "right" &&
                            newColumnWidth.forColumn === "left"
                        ) {
                            const originalMainColumn = mainColumn;
                            mainColumn = adjustedColumn;
                            adjustedColumn = this.resizeUtils.getAdjacentColumn(originalMainColumn, "+1");
                        }

                        this.recordResizeHistory(
                            usedHistory,
                            direction,
                            adjustedColumn,
                            modifyColumnInPair,
                        );
                        this.resizeLastPosition = newColumnWidth.position;

                        this.resizeLastColumnInPair = modifyColumnInPair;

                        this.onColumnResize(
                            mainColumn,
                            newColumnWidth.width,
                            adjustedColumn,
                        );

                        // Wait for the render cycle to finish from the above resize before re-calculating
                        _.defer(() => {
                            // If we do a resize, re-calculate the column widths
                            this.resizeColumnWidths = this.resizeUtils.determineColumnWidths(
                                this.resizeColumnInstance,
                                groupPosition,
                            );
                            this.resizeMaxGhostWidth = this.resizeUtils.determineMaxGhostWidth(
                                this.resizeColumnWidths,
                            );
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
     * @param {GroupPositionCache} groupPosition
     */
    private onDraggingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>, groupPosition: GroupPositionCache) {
        const dragColumn = getDragColumn();
        if (dragColumn) {
            // If the drop positions haven't been calculated for this group do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = calculateDropPositions(this.parent);
            }
            const columnInstance = dragColumn;
            const currentX = event.pageX - groupPosition.left;

            // Are we within the same column group or have we ended up over another?
            if (columnInstance.parent === this.parent) {
                const currentColumn = dragColumn.preview.element;
                const currentColumnRight = currentColumn.position().left + currentColumn.width();
                const lastColInGroup = this.parent.children()[this.parent.children().length - 1].preview.element;
                const insertLastPos = lastColInGroup.position().left + (lastColInGroup.width() / 2);

                this.movePosition = this.dropPositions.find((position) => {
                    // Only ever look for the left placement, except the last item where we look on the right
                    const placement = (currentX >= insertLastPos ? "right" : "left");
                    // There is 200px area over each column borders
                    return this.resizeUtils.comparator(currentX, position[placement], 100) &&
                        !this.resizeUtils.comparator(currentX, currentColumnRight, 100) &&
                        position.affectedColumn !== columnInstance && // Check affected column isn't the current column
                        position.placement === placement; // Verify the position, we only check left on sorting
                });

                if (this.movePosition) {
                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        right: (this.movePosition.placement === "right" ?
                                groupPosition.outerWidth - this.movePosition.right - 5 : ""
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
                                groupPosition.width - this.movePosition.right : ""
                        ),
                        width: groupPosition.width / this.resizeUtils.getGridSize() + "px",
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
     * @param {GroupPositionCache} groupPosition
     */
    private onDroppingMouseMove(event: JQuery.Event, group: JQuery<HTMLElement>, groupPosition: GroupPositionCache) {
        const elementChildrenParent = group.parents(".element-children");
        // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly
        if (
            this.dropOverElement &&
            event.pageY > groupPosition.top + 20 &&
            event.pageY < (groupPosition.top + groupPosition.outerHeight) - 20
        ) {
            // Disable the parent sortable instance
            if (elementChildrenParent.data("sortable")) {
                elementChildrenParent.sortable("option", "disabled", true);
            }

            const currentX = event.pageX - groupPosition.left;
            this.dropPosition = this.dropPositions.find((position) => {
                return currentX > position.left && currentX < position.right && position.canShrink;
            });

            if (this.dropPosition) {
                this.dropPlaceholder.removeClass("left right").css({
                    left: (this.dropPosition.placement === "left" ? this.dropPosition.left : ""),
                    right:
                        (this.dropPosition.placement === "right" ? groupPosition.width - this.dropPosition.right : ""),
                    width: groupPosition.width / this.resizeUtils.getGridSize() + "px",
                }).addClass(this.dropPosition.placement);
            }
        } else if (this.dropOverElement) {
            // Re-enable the parent sortable instance
            if (elementChildrenParent.data("sortable")) {
                elementChildrenParent.sortable("option", "disabled", false);
            }
            this.dropPosition = null;
            this.dropPlaceholder.removeClass("left right");
        }
    }

    /**
     * Init the droppable functionality for new columns
     *
     * @param {JQuery<HTMLElement>} group
     */
    private initDroppable(group: JQuery<HTMLElement>) {
        const self = this;
        let headStyles: HTMLStyleElement;

        group.droppable({
            deactivate() {
                self.dropOverElement = null;
                self.dropPlaceholder.removeClass("left right");

                _.defer(() => {
                    // Re-enable the parent sortable instance & all children sortable instances
                    group.parents(".element-children").each(function() {
                        if ($(this).data("sortable")) {
                            $(this).sortable("option", "disabled", false);
                        }
                    });
                });
            },
            activate() {
                if (getDraggedContentTypeConfig() === Config.getContentTypeConfig("column")) {
                    group.find(".ui-sortable").each(function() {
                        if ($(this).data("sortable")) {
                            $(this).sortable("option", "disabled", true);
                        }
                    });

                    const classes = [
                        ".pagebuilder-content-type.pagebuilder-column .pagebuilder-drop-indicator",
                        ".pagebuilder-content-type.pagebuilder-column .empty-container .content-type-container:before",
                    ];

                    // Ensure we don't display any drop indicators inside the column
                    headStyles = createStyleSheet({
                        [classes.join(", ")]: {
                            display: "none!important",
                        },
                    });
                    document.head.appendChild(headStyles);
                } else if (headStyles) {
                    headStyles.remove();
                    headStyles = null;
                }
            },
            drop() {
                self.dropPositions = [];
                self.dropPlaceholder.removeClass("left right");
            },
            out() {
                self.dropOverElement = null;
                self.dropPlaceholder.removeClass("left right");
            },
            over() {
                // Always calculate drop positions when an element is dragged over
                self.dropPositions = calculateDropPositions(self.parent);

                // Is the element currently being dragged a column?
                if (getDraggedContentTypeConfig() === Config.getContentTypeConfig("column")) {
                    self.dropOverElement = true;
                } else {
                    self.dropOverElement = null;
                }
            },
        });
    }

    /**
     * Spread any empty space across the other columns
     *
     * @param {Event} event
     * @param {ContentTypeRemovedParams} params
     */
    private spreadWidth(event: Event, params: ContentTypeRemovedParams) {
        if (this.parent.children().length === 0) {
            return;
        }

        const availableWidth = 100 - this.resizeUtils.getColumnsWidth();
        const formattedAvailableWidth = this.resizeUtils.getRoundedColumnWidth(availableWidth);
        const totalChildColumns = this.parent.children().length;
        const allowedColumnWidths = [];
        let spreadAcross = 1;
        let spreadAmount;

        for (let i = this.resizeUtils.getGridSize(); i > 0; i--) {
            allowedColumnWidths.push(
                this.resizeUtils.getRoundedColumnWidth(100 / this.resizeUtils.getGridSize() * i),
            );
        }

        // Determine how we can spread the empty space across the columns
        for (let i = totalChildColumns; i > 0; i--) {
            const potentialWidth = Math.floor(formattedAvailableWidth / i);
            for (const width of allowedColumnWidths) {
                if (potentialWidth === Math.floor(width)) {
                    spreadAcross = i;
                    spreadAmount = formattedAvailableWidth / i;
                    break;
                }
            }
            if (spreadAmount) {
                break;
            }
        }

        // Let's spread the width across the columns
        for (let i = 1; i <= spreadAcross; i++) {
            let columnToModify: ContentTypeCollectionInterface<ColumnPreview>;

            // As the original column has been removed from the array, check the new index for a column
            if ((params.index) <= this.parent.children().length
                && typeof this.parent.children()[params.index] !== "undefined") {
                columnToModify = this.parent.children()[params.index];
            }
            if (!columnToModify && (params.index - i) >= 0 &&
                typeof this.parent.children()[params.index - i] !== "undefined"
            ) {
                columnToModify = this.parent.children()[params.index - i];
            }
            if (columnToModify) {
                this.resizeUtils.updateColumnWidth(
                    columnToModify,
                    this.resizeUtils.getColumnWidth(columnToModify) + spreadAmount,
                );
            }
        }
    }

    /**
     * Remove self if we contain no children
     */
    private removeIfEmpty() {
        if (this.parent.children().length === 0) {
            this.parent.parent.removeChild(this.parent);
            return;
        }
    }
}

export interface GroupPositionCache {
    left: number;
    top: number;
    width: number;
    height: number;
    outerWidth: number;
    outerHeight: number;
}

export interface ResizeHistory {
    left: ResizeHistoryItem[];
    right: ResizeHistoryItem[];
    [key: string]: ResizeHistoryItem[];
}

export interface ResizeHistoryItem {
    adjustedColumn: ContentTypeCollectionInterface<ColumnPreview>;
    modifyColumnInPair: string;
}

export interface MaxGhostWidth {
    left: number;
    right: number;
}

export interface ColumnWidth {
    name: string;
    position: number;
    width: number;
    forColumn: string;
}
