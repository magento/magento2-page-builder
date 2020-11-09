/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import Config from "../../config";
import ColumnGroup from "../../content-type-collection";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ContentTypeConfigInterface from "../../content-type-config.types";
import {DataObject} from "../../data-store";
import {moveContentType} from "../../drag-drop/move-content-type";
import {getDraggedContentTypeConfig} from "../../drag-drop/registry";
import {hiddenClass} from "../../drag-drop/sortable";
import checkStageFullScreen from "../../utils/check-stage-full-screen";
import {createStyleSheet} from "../../utils/create-stylesheet";
import pageBuilderHeaderHeight from "../../utils/pagebuilder-header-height";
import {default as ColumnGroupPreview} from "../column-group/preview";
import {BindResizeHandleEventParamsInterface, InitElementEventParamsInterface} from "../column/column-events.types";
import ColumnPreview from "../column/preview";
import Resize, {
    comparator, determineMaxGhostWidth, getAdjacentColumn, getColumnIndexInGroup,
    getRoundedColumnWidth, updateColumnWidth,
} from "../column/resize";
import {ContentTypeRemovedEventParamsInterface} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";
import {calculateDropPositions, DropPosition} from "./drag-and-drop";
import {createColumn} from "./factory";
import {getMaxGridSize, GridSizeError, resizeGrid} from "./grid-size";
import {getDragColumn, removeDragColumn, setDragColumn} from "./registry";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public contentType: ContentTypeCollectionInterface<ColumnGroupPreview>;
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    public hasEmptyChild: KnockoutComputed<boolean> = ko.computed(() => {
        let empty: boolean = false;
        this.contentType.getChildren()()
            .forEach((column: ColumnGroup) => {
                if (column.getChildren()().length === 0) {
                    empty = true;
                }
            });
        return empty;
    });
    public gridSize: KnockoutObservable<number> = ko.observable();
    public gridSizeInput: KnockoutObservable<number> = ko.observable();
    public gridSizeArray: KnockoutObservableArray<any[]> = ko.observableArray([]);
    public gridSizeError: KnockoutObservable<string> = ko.observable();
    public gridSizeMax: KnockoutObservable<number> = ko.observable(getMaxGridSize());
    public gridFormOpen: KnockoutObservable<boolean> = ko.observable(false);
    public gridChange: KnockoutObservable<boolean> = ko.observable(false);
    public gridToolTipOverFlow: KnockoutObservable<boolean> = ko.observable(false);
    private dropPlaceholder: JQuery;
    private movePlaceholder: JQuery;
    private groupElement: JQuery;
    private resizeGhost: JQuery;
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
    private resizeUtils: Resize;
    private gridSizeHistory: Map<number, number[]> = new Map();
    private interactionLevel: number = 0;
    private startDragEvent: JQueryEventObject;

    /**
     *
     * @param {ContentTypeCollection} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ColumnGroup,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);
        this.resizeUtils = new Resize(this.contentType);

        // Keep track of the grid size in an observable
        this.contentType.dataStore.subscribe((state: DataObject) => {
            const gridSize = parseInt(state.grid_size.toString(), 10);
            this.gridSize(gridSize);
            this.gridSizeInput(gridSize);
            if (gridSize) {
                this.gridSizeArray(new Array(gridSize));
            }
        }, "grid_size");

        events.on("contentType:removeAfter", (args: ContentTypeRemovedEventParamsInterface) => {
            if (args.parentContentType && args.parentContentType.id === this.contentType.id) {
                _.defer(() => {
                    this.spreadWidth(args.index);
                });
            }
        });

        // Listen for resizing events from child columns
        events.on("column:resizeHandleBindAfter", (args: BindResizeHandleEventParamsInterface) => {
            // Does the events content type match the previews column group?
            if (args.columnGroup.id === this.contentType.id) {
                this.registerResizeHandle(args.column, args.handle);
            }
        });
        events.on("column:initializeAfter", (args: InitElementEventParamsInterface) => {
            // Does the events parent match the previews column group?
            if (args.columnGroup.id === this.contentType.id) {
                this.bindDraggable(args.column);
            }
        });

        this.contentType.children.subscribe(
            _.debounce(
                this.removeIfEmpty.bind(this),
                50,
            ),
        );
    }

    /**
     * Retrieve the resize utils
     *
     * @returns {Resize}
     */
    public getResizeUtils(): Resize {
        return this.resizeUtils;
    }

    /**
     * Handle a new column being dropped into the group
     *
     * @param {DropPosition} dropPosition
     */
    public onNewColumnDrop(dropPosition: DropPosition) {
        // Create our new column
        createColumn(
            this.contentType,
            this.resizeUtils.getSmallestColumnWidth(),
            dropPosition.insertIndex,
        ).then(() => {
            const newWidth = this.resizeUtils.getAcceptedColumnWidth(
                (this.resizeUtils.getColumnWidth(dropPosition.affectedColumn) -
                    this.resizeUtils.getSmallestColumnWidth()).toString(),
            );

            // Reduce the affected columns width by the smallest column width
            updateColumnWidth(dropPosition.affectedColumn, newWidth);
        });
    }

    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {DropPosition} movePosition
     */
    public onExistingColumnDrop(movePosition: DropPosition) {
        const column = getDragColumn();
        const sourceGroupPreview = column.parentContentType.preview as ColumnGroupPreview;
        let modifyOldNeighbour;

        // Determine which old neighbour we should modify
        const oldWidth = sourceGroupPreview.getResizeUtils().getColumnWidth(column);

        // Retrieve the adjacent column either +1 or -1
        if (getAdjacentColumn(column, "+1")) {
            modifyOldNeighbour = getAdjacentColumn(column, "+1");
        } else if (getAdjacentColumn(column, "-1")) {
            modifyOldNeighbour = getAdjacentColumn(column, "-1");
        }

        // Set the column to it's smallest column width
        updateColumnWidth(column, this.resizeUtils.getSmallestColumnWidth());

        // Move the content type
        moveContentType(column, movePosition.insertIndex, this.contentType);

        // Modify the old neighbour
        if (modifyOldNeighbour) {
            const oldNeighbourWidth = sourceGroupPreview.getResizeUtils().getAcceptedColumnWidth(
                (oldWidth + sourceGroupPreview.getResizeUtils().getColumnWidth(modifyOldNeighbour)).toString(),
            );
            updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
        }

        // Modify the columns new neighbour
        const newNeighbourWidth = this.resizeUtils.getAcceptedColumnWidth(
            (this.resizeUtils.getColumnWidth(movePosition.affectedColumn) -
                this.resizeUtils.getSmallestColumnWidth()).toString(),
        );

        // Reduce the affected columns width by the smallest column width
        updateColumnWidth(movePosition.affectedColumn, newNeighbourWidth);
    }

    /**
     * Handle a column being sorted into a new position in the group
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} newIndex
     */
    public onColumnSort(column: ContentTypeCollectionInterface<ColumnPreview>, newIndex: number) {
        const currentIndex = getColumnIndexInGroup(column);
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
     * @param {JQuery} handle
     */
    public registerResizeHandle(column: ContentTypeCollectionInterface<ColumnPreview>, handle: JQuery) {
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
            this.resizeMaxGhostWidth = determineMaxGhostWidth(this.resizeColumnWidths);

            // Force the cursor to resizing
            $("body").css("cursor", "col-resize");

            // Reset the resize history
            this.resizeHistory = {
                left: [],
                right: [],
            };

            this.resizeLastPosition = null;
            this.resizeMouseDown = true;

            ++this.interactionLevel;
            events.trigger("stage:interactionStart", {stageId: this.contentType.stageId});
        });
    }

    /**
     * Bind draggable instances to the child columns
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     */
    public bindDraggable(column: ContentTypeCollectionInterface<ColumnPreview>): void {
        column.preview.element.draggable({
            appendTo: "body",
            containment: "body",
            cursor: "-webkit-grabbing",
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
                    zIndex: 5000,
                });
                return helper;
            },
            start: (event: JQueryEventObject) => {
                const columnInstance: ColumnPreview = ko.dataFor($(event.target)[0]);
                // Use the global state as columns can be dragged between groups
                setDragColumn((columnInstance.contentType as ContentTypeCollectionInterface<ColumnPreview>));
                this.dropPositions = calculateDropPositions(this.contentType);
                this.startDragEvent = event;

                events.trigger("column:dragStart", {
                    column: columnInstance,
                    stageId: this.contentType.stageId,
                });
                events.trigger("stage:interactionStart", {stageId: this.contentType.stageId});
            },
            stop: () => {
                const draggedColumn = getDragColumn();
                if (this.movePosition && draggedColumn) {
                    // Check if we're moving within the same group, even though this function will
                    // only ever run on the group that bound the draggable event
                    if (draggedColumn.parentContentType === this.contentType) {
                        this.onColumnSort(draggedColumn, this.movePosition.insertIndex);
                        this.movePosition = null;
                    }
                }

                removeDragColumn();

                this.dropPlaceholder.removeClass("left right");
                this.movePlaceholder.removeClass("active");
                this.startDragEvent = null;

                events.trigger("column:dragStop", {
                    column: draggedColumn,
                    stageId: this.contentType.stageId,
                });
                events.trigger("stage:interactionStop", {stageId: this.contentType.stageId});
            },
        });
    }

    /**
     * Update the grid size on enter or blur of the input
     */
    public updateGridSize() {
        if (!$.isNumeric(this.gridSizeInput())) {
            this.gridSizeError($t("Please enter a valid number."));
        }

        const newGridSize = parseInt(this.gridSizeInput().toString(), 10);
        if (newGridSize || newGridSize === 0) {
            if (newGridSize !== this.resizeUtils.getGridSize()) {
                try {
                    resizeGrid(
                        this.contentType,
                        newGridSize,
                        this.gridSizeHistory,
                    );
                    this.recordGridResize(newGridSize);
                    this.gridSizeError(null);

                    // Make the grid "flash" on successful change
                    this.gridChange(true);
                    _.delay(() => {
                        this.gridChange(false);
                    }, 1000);
                } catch (e) {
                    if (e instanceof GridSizeError) {
                        this.gridSizeError(e.message);
                    } else {
                        throw e;
                    }
                }
            } else {
                this.gridSizeError(null);
            }
        }
    }

    /**
     * On grid input key up, check if the enter key was used and submit
     *
     * @param {Preview} context
     * @param {KeyboardEvent} event
     */
    public onGridInputKeyUp(context: Preview, event: KeyboardEvent) {
        if (event.which === 13 || event.keyCode === 13) {
            this.updateGridSize();
        }
    }

    /**
     * On grid input blur, update the grid size
     */
    public onGridInputBlur() {
        this.updateGridSize();
    }

    /**
     * Hide grid size panel on focus out
     */
    public closeGridForm(): void {
        this.updateGridSize();
        if (!this.gridSizeError()) {
            this.gridFormOpen(false);
            this.gridToolTipOverFlow(false);
            events.trigger("stage:interactionStop");
            events.trigger("stage:childFocusStop");
            $(document).off("click focusin", this.onDocumentClick);
        }
    }

    /**
     * Show grid size panel on click and start interaction
     */
    public openGridForm(): void {
        const tooltip = $(this.wrapperElement).find("[role='tooltip']");
        if (!this.gridFormOpen()) {
            this.gridSizeHistory = new Map();
            this.recordGridResize(this.gridSize());
            // inline tooltip out of bounds
            const tooltipClientRectTop = tooltip[0].getBoundingClientRect().top
                                     - pageBuilderHeaderHeight(this.contentType.stageId);

            if (checkStageFullScreen(this.contentType.stageId)
                && tooltip[0].getBoundingClientRect().height > tooltipClientRectTop
            ) {
                this.gridToolTipOverFlow(true);
            }
            this.gridFormOpen(true);
            // Wait for animation to complete
            _.delay(() => {
                $(this.wrapperElement).find(".grid-panel-item-wrapper input").focus().select();
            }, 200);
            $(document).on("click focusin", this.onDocumentClick);
            events.trigger("stage:interactionStart");
            events.trigger("stage:childFocusStart");
        }
    }

    /**
     * Handle a click on the document closing the grid form
     *
     * @param {Event} event
     */
    private onDocumentClick = (event: JQueryEventObject) => {
        // Verify the click event wasn't within our form
        if (!$.contains($(this.wrapperElement).find(".pagebuilder-grid-size-indicator")[0], $(event.target)[0])) {
            this.closeGridForm();
        }
    }

    /**
     * Set columns in the group as resizing
     *
     * @param {Array<ContentTypeCollectionInterface<ColumnPreview>>} columns
     */
    private setColumnsAsResizing(...columns: Array<ContentTypeCollectionInterface<ColumnPreview>>): void {
        columns.forEach((column) => {
            column.preview.resizing(true);
            column.preview.element.css({transition: `width 350ms ease-in-out`});
        });
    }

    /**
     * Unset resizing flag on all child columns
     */
    private unsetResizingColumns(): void {
        this.contentType.children().forEach((column: ContentTypeCollectionInterface<ColumnPreview>) => {
            column.preview.resizing(false);
            if (column.preview.element) {
                column.preview.element.css({transition: ""});
            }
        });
    }

    /**
     * End all current interactions
     */
    private endAllInteractions(): void {
        if (this.resizing() === true) {
            for (; this.interactionLevel > 0; this.interactionLevel--) {
                events.trigger("stage:interactionStop", {stageId: this.contentType.stageId});
            }
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
     * @param {JQuery} group
     */
    private initMouseMove(group: JQuery): void {
        let intersects: boolean = false;
        $(document).on("mousemove touchmove", (event: JQueryEventObject) => {
            if (group.parents(hiddenClass).length > 0) {
                return;
            }

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
    private handleMouseUp(): void {
        if (this.dropOverElement && this.dropPosition) {
            this.onNewColumnDrop(this.dropPosition);
            this.dropOverElement = null;

            // Re-enable the parent disabled sortable instance
            _.defer(() => {
                $(".element-children.ui-sortable-disabled").each(function() {
                    $(this).sortable("option", "disabled", false);
                });
            });
        }

        const column = getDragColumn();

        if (this.movePosition && column && column.parentContentType !== this.contentType) {
            this.onExistingColumnDrop(this.movePosition);
        }
    }

    /**
     * Does the current event intersect with the group?
     *
     * @param {JQueryEventObject} event
     * @param {GroupPositionCache} groupPosition
     * @returns {boolean}
     */
    private eventIntersectsGroup(event: JQueryEventObject, groupPosition: GroupPositionCache): boolean {
        return event.pageY > groupPosition.top &&
            event.pageY < (groupPosition.top + groupPosition.outerHeight) &&
            event.pageX > groupPosition.left &&
            event.pageX < (groupPosition.left + groupPosition.outerWidth);
    }

    /**
     * Cache the groups positions
     *
     * @param {JQuery} group
     * @returns {GroupPositionCache}
     */
    private getGroupPosition(group: JQuery): GroupPositionCache {
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
    ): void {
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
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    private onResizingMouseMove(event: JQueryEventObject, group: JQuery, groupPosition: GroupPositionCache): void {
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
                    return comparator(currentPos, val.position, 35)
                        && val.forColumn === modifyColumnInPair;
                });

                if (newColumnWidth) {
                    let mainColumn = this.resizeColumnInstance;
                    // If we're using the left data set, we're actually resizing the right column of the group
                    if (modifyColumnInPair === "right") {
                        mainColumn = getAdjacentColumn(this.resizeColumnInstance, "+1");
                    }

                    // Ensure we aren't resizing multiple times, also validate the last resize isn't the same as the
                    // one being performed now. This occurs as we re-calculate the column positions on resize, we have
                    // to use the comparator as the calculation may result in slightly different numbers due to rounding
                    if (this.resizeUtils.getColumnWidth(mainColumn) !== newColumnWidth.width &&
                        !comparator(this.resizeLastPosition, newColumnWidth.position, 10)
                    ) {
                        // If our previous action was to resize the right column in pair, and we're now dragging back
                        // to the right, but have matched a column for the left we need to fix the columns being
                        // affected
                        if (usedHistory && this.resizeLastColumnInPair === "right" && direction === "right" &&
                            newColumnWidth.forColumn === "left"
                        ) {
                            const originalMainColumn = mainColumn;
                            mainColumn = adjustedColumn;
                            adjustedColumn = getAdjacentColumn(originalMainColumn, "+1");
                        }

                        this.recordResizeHistory(
                            usedHistory,
                            direction,
                            adjustedColumn,
                            modifyColumnInPair,
                        );
                        this.resizeLastPosition = newColumnWidth.position;

                        this.resizeLastColumnInPair = modifyColumnInPair;

                        // Ensure the adjusted column is marked as resizing to animate correctly
                        this.setColumnsAsResizing(mainColumn, adjustedColumn);

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
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    private onDraggingMouseMove(event: JQueryEventObject, group: JQuery, groupPosition: GroupPositionCache): void {
        const dragColumn = getDragColumn();
        if (dragColumn) {
            // If the drop positions haven't been calculated for this group do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = calculateDropPositions(this.contentType);
            }
            const columnInstance = dragColumn;
            const currentX = event.pageX - groupPosition.left;

            // Are we within the same column group or have we ended up over another?
            if (columnInstance.parentContentType === this.contentType && this.startDragEvent) {
                const dragDirection = (event.pageX <= this.startDragEvent.pageX ? "left" : "right");
                const adjacentLeftColumn = getAdjacentColumn(dragColumn, "-1");

                // Determine the current move position based on the cursors position and direction of drag
                this.movePosition = this.dropPositions.find((position) => {
                    return currentX > position.left && currentX < position.right &&
                        position.placement === dragDirection && position.affectedColumn !== dragColumn;
                });

                // Differences in the element & event positions cause a right movement to activate on the left column
                if (this.movePosition && dragDirection === "right" &&
                    this.movePosition.affectedColumn === adjacentLeftColumn
                ) {
                    this.movePosition = null;
                }

                if (this.movePosition) {
                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        right: (this.movePosition.placement === "right"
                            ? groupPosition.width - this.movePosition.right : ""),
                        width: dragColumn.preview.element.outerWidth() + "px",
                    }).addClass("active");
                } else {
                    this.movePlaceholder.removeClass("active");
                }
            } else {
                // If we're moving to another column group we utilise the existing drop placeholder
                this.movePosition = this.dropPositions.find((position) => {
                    return currentX > position.left && currentX <= position.right && position.canShrink;
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
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    private onDroppingMouseMove(event: JQueryEventObject, group: JQuery, groupPosition: GroupPositionCache): void {
        const elementChildrenParent = group.parents(".element-children");
        // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly
        if (
            this.dropOverElement &&
            event.pageY > groupPosition.top + 20 &&
            event.pageY < (groupPosition.top + groupPosition.outerHeight) - 20
        ) {
            // Disable the column group sortable instance
            if (elementChildrenParent.data("sortable")) {
                elementChildrenParent.sortable("option", "disabled", true);
            }

            const currentX = event.pageX - groupPosition.left;
            this.dropPosition = this.dropPositions.find((position) => {
                return currentX > position.left && currentX <= position.right && position.canShrink;
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
            // Re-enable the column group sortable instance
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
     * @param {JQuery} group
     */
    private initDroppable(group: JQuery): void {
        const self = this;
        let headStyles: HTMLStyleElement;

        group.droppable({
            deactivate() {
                self.dropOverElement = null;
                self.dropPlaceholder.removeClass("left right");

                _.defer(() => {
                    // Re-enable the column group sortable instance & all children sortable instances
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
                // Is the element currently being dragged a column?
                if (getDraggedContentTypeConfig() === Config.getContentTypeConfig("column")) {
                    // Always calculate drop positions when an element is dragged over
                    self.dropPositions = calculateDropPositions(
                        self.contentType as ContentTypeCollectionInterface<ColumnGroupPreview>,
                    );

                    self.dropOverElement = true;
                } else {
                    self.dropOverElement = null;
                }
            },
        });
    }

    /**
     * Spread any empty space across the other columns when a column is removed
     *
     * @param {number} removedIndex
     */
    private spreadWidth(removedIndex: number): void {
        if (this.contentType.children().length === 0) {
            return;
        }

        const availableWidth = 100 - this.resizeUtils.getColumnsWidth();
        const formattedAvailableWidth = getRoundedColumnWidth(availableWidth);
        const totalChildColumns = this.contentType.children().length;
        const allowedColumnWidths = [];
        let spreadAcross = 1;
        let spreadAmount;

        for (let i = this.resizeUtils.getGridSize(); i > 0; i--) {
            allowedColumnWidths.push(
                getRoundedColumnWidth(100 / this.resizeUtils.getGridSize() * i),
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
            if (removedIndex <= this.contentType.children().length
                && typeof this.contentType.children()[removedIndex] !== "undefined") {
                columnToModify = this
                    .contentType
                    .children()[removedIndex] as ContentTypeCollectionInterface<ColumnPreview>;
            }
            if (!columnToModify && (removedIndex - i) >= 0 &&
                typeof this.contentType.children()[removedIndex - i] !== "undefined"
            ) {
                columnToModify =
                    this.contentType.children()[removedIndex - i] as ContentTypeCollectionInterface<ColumnPreview>;
            }
            if (columnToModify) {
                updateColumnWidth(
                    columnToModify,
                    this.resizeUtils.getColumnWidth(columnToModify) + spreadAmount,
                );
            }
        }
    }

    /**
     * Remove self if we contain no children
     */
    private removeIfEmpty(): void {
        if (this.contentType.children().length === 0) {
            this.contentType.parentContentType.removeChild(this.contentType);
            return;
        }
    }

    /**
     * Record the grid resize operation into a history for later restoration
     *
     * @param {number} newGridSize
     */
    private recordGridResize(newGridSize: number): void {
        if (!this.gridSizeHistory.has(newGridSize)) {
            const columnWidths: number[] = [];
            this.contentType.getChildren()().forEach(
                (column: ContentTypeCollectionInterface<ColumnPreview>) => {
                    columnWidths.push(this.resizeUtils.getColumnWidth(column));
                });
            this.gridSizeHistory.set(newGridSize, columnWidths);
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
