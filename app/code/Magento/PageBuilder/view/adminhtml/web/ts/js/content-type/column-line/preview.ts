/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import ColumnLine from "Magento_PageBuilder/js/content-type-collection";
import ContentTypeConfigInterface from "Magento_PageBuilder/js/content-type-config.types";
import createContentType from "Magento_PageBuilder/js/content-type-factory";
import ContentTypeInterface from "Magento_PageBuilder/js/content-type.types";
import {createColumn, createColumnLine} from "Magento_PageBuilder/js/content-type/column-group/factory";
import {
    ColumnWidth,
    GroupPositionCache,
    LinePositionCache,
    MaxGhostWidth,
    ResizeHistory,
} from "Magento_PageBuilder/js/content-type/column-group/preview";
import ColumnGroupPreview from "Magento_PageBuilder/js/content-type/column-group/preview";
import {
    getDragColumn,
    removeDragColumn,
    setDragColumn,
} from "Magento_PageBuilder/js/content-type/column-group/registry";
import {
    BindResizeHandleEventParamsInterface,
    InitElementEventParamsInterface,
} from "Magento_PageBuilder/js/content-type/column/column-events.types";
import ColumnPreview from "Magento_PageBuilder/js/content-type/column/preview";
import {
    ContentTypeDroppedCreateEventParamsInterface,
    ContentTypeRemovedEventParamsInterface,
} from "Magento_PageBuilder/js/content-type/content-type-events.types";
import ObservableUpdater from "Magento_PageBuilder/js/content-type/observable-updater";
import {moveContentType} from "Magento_PageBuilder/js/drag-drop/move-content-type";
import {getDraggedContentTypeConfig} from "Magento_PageBuilder/js/drag-drop/registry";
import {hiddenClass} from "Magento_PageBuilder/js/drag-drop/sortable";
import events from "Magento_PageBuilder/js/events";
import {createStyleSheet} from "Magento_PageBuilder/js/utils/create-stylesheet";
import _ from "underscore";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import {getDefaultGridSize} from "../column-group/grid-size";
import {default as ColumnLinePreview} from "../column-line/preview";
import Resize, {
    comparator,
    determineMaxGhostWidth,
    getAdjacentColumn,
    getColumnIndexInLine,
    getRoundedColumnWidth,
    updateColumnWidth,
} from "../column/resize";
import PreviewCollection from "../preview-collection";
import {calculateDropPositions, DropPosition} from "./drag-and-drop";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public contentType: ContentTypeCollectionInterface<ColumnLinePreview>;
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    public gridSizeArray: KnockoutObservableArray<any[]> = ko.observableArray([]);
    public element: JQuery;
    private dropPlaceholder: JQuery;
    private movePlaceholder: any;
    private dropPositions: DropPosition[] = [];
    private dropPosition: DropPosition;
    private startDragEvent: JQueryEventObject;
    private movePosition: DropPosition;
    private dropOverElement: boolean;
    private resizeUtils: Resize;
    private linePositionCache: LinePositionCache;
    private columnLineDropPlaceholder: JQuery;
    private resizeColumnInstance: ContentTypeCollectionInterface<ColumnPreview>;
    private resizeColumnWidths: ColumnWidth[];
    private resizeMaxGhostWidth: MaxGhostWidth;
    private resizeHistory: ResizeHistory = {
        left: [],
        right: [],
    };
    private resizeLastPosition: number;
    private resizeLastColumnInPair: string;
    private resizeMouseDown: boolean;
    private interactionLevel: number = 0;
    private lineDropperHeight: number = 50;
    private resizeGhost: JQuery;
    private resizeLeftLastColumnShrunk: ContentTypeCollectionInterface<ColumnPreview>;
    private resizeRightLastColumnShrunk: ContentTypeCollectionInterface<ColumnPreview>;
    private columnLineBottomDropPlaceholder: JQuery;

    /**
     *
     * @param {ContentTypeCollection} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ColumnLine,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);
        this.resizeUtils = new Resize(this.contentType.parentContentType, this.contentType);

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
            if (args.columnLine.id === this.contentType.id) {
                this.registerResizeHandle(args.column, args.handle);
            }
        });
        events.on("column:initializeAfter", (args: InitElementEventParamsInterface) => {
            // Does the events parent match the previews column group?
            if (args.columnGroup.id === this.contentType.id) {
                this.bindDraggable(args.column);
            }
        });

        const parentPreview = this.contentType.parentContentType.preview as ColumnGroupPreview;
        this.gridSizeArray(parentPreview.gridSizeArray());
        parentPreview.gridSizeArray.subscribe((gridSize: any[]) => {
            this.gridSizeArray(gridSize);
        });

        this.contentType.children.subscribe(
            _.debounce(
                this.removeIfEmpty.bind(this),
                50,
            ),
        );
    }

    /**
     * Bind events
     */
    public bindEvents() {
        super.bindEvents();

        if (Config.getContentTypeConfig("column")) {
            events.on("column-line:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
                if (args.id === this.contentType.id) {
                     this.createColumns();
                }
            });
        }

        events.on("column:initializeAfter", (args: InitElementEventParamsInterface) => {
            // Does the events parent match the previews column group?
            if (args.columnLine.id === this.contentType.id) {
                this.bindDraggable(args.column);

            }
        });
    }

    /**
     * Init the droppable & resizing interactions
     *
     * @param line
     */
    public bindInteractions(line: Element) {
        this.element = $(line);
        this.initDroppable(this.element);
        this.initMouseMove(this.element);

        // Handle the mouse leaving the window
      //  $("body").mouseleave(this.endAllInteractions.bind(this));
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
     * Init the drop placeholder
     *
     * @param {Element} element
     */
    public bindColumnLineBottomDropPlaceholder(element: Element) {
        this.columnLineBottomDropPlaceholder = $(element);
    }

    /**
     * Init the drop placeholder
     *
     * @param {Element} element
     */
    public bindColumnLineDropPlaceholder(element: Element) {
        this.columnLineDropPlaceholder = $(element);
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
     * Retrieve the resize utils
     *
     * @returns {Resize}
     */
    public getResizeUtils(): Resize {
        return this.resizeUtils;
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
                        // todo see from column group
                    }
                }

                removeDragColumn();

                this.dropPlaceholder.removeClass("left right");

                this.movePlaceholder.removeClass("active");
                this.movePosition = null;
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
     * Handle a column being sorted into a new position in the column line
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} newIndex
     */
    public onColumnSort(column: ContentTypeCollectionInterface<ColumnPreview>, newIndex: number) {
        const currentIndex = getColumnIndexInLine(column);
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
     * Handle a new column being dropped into the group
     *
     * @param {DropPosition} dropPosition
     */
    private onNewColumnDrop(dropPosition: DropPosition) {
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
     * Handle an existing column being dropped into a different column line
     *
     * @param {DropPosition} movePosition
     */
    private onExistingColumnDrop(movePosition: DropPosition) {
        const column = getDragColumn();
        const sourceLinePreview = column.parentContentType.preview as ColumnLinePreview;
        let modifyOldNeighbour: ContentTypeCollectionInterface<ColumnPreview>;

        // Determine which old neighbour we should modify
        const oldWidth = sourceLinePreview.getResizeUtils().getColumnWidth(column);
        let direction = "+1";

        // Retrieve the adjacent column either +1 or -1
        if (getAdjacentColumn(column, "+1")) {
            modifyOldNeighbour = getAdjacentColumn(column, "+1");
        } else if (getAdjacentColumn(column, "-1")) {
            direction = "-1";
            modifyOldNeighbour = getAdjacentColumn(column, "-1");
        }

        // Modify the old neighbour
        let oldNeighbourWidth = 100;
        if (modifyOldNeighbour) {
            oldNeighbourWidth = sourceLinePreview.getResizeUtils().getAcceptedColumnWidth(
                (oldWidth + sourceLinePreview.getResizeUtils().getColumnWidth(modifyOldNeighbour)).toString(),
            );

        }

        // Move the content type
        if (this.columnLineDropPlaceholder.hasClass("active")) {
            // if new column line placeholders are visible, add new column line and move column there
            createColumnLine(
                this.contentType.parentContentType,
                this.resizeUtils.getSmallestColumnWidth(),
                this.getNewColumnLineIndex(),
            ).then((columnLine) => {

                moveContentType(column, 0, columnLine);
                updateColumnWidth(column, 100);
                if (modifyOldNeighbour) {
                    updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
                }
                this.fireMountEvent(this.contentType, column);

            });
        } else if (this.columnLineBottomDropPlaceholder.hasClass("active")) {
            // if new column line placeholders are visible, add new column line and move column there
            createColumnLine(
                this.contentType.parentContentType,
                this.resizeUtils.getSmallestColumnWidth(),
                this.getNewColumnLineIndex(),
            ).then((columnLine) => {

                moveContentType(column, 0, columnLine);
                updateColumnWidth(column, 100);
                if (modifyOldNeighbour) {
                    updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
                }
                this.fireMountEvent(this.contentType, column);

            });
        } else {
            moveContentType(column, movePosition.insertIndex, this.contentType);
            if (modifyOldNeighbour) {
                updateColumnWidth(modifyOldNeighbour, oldNeighbourWidth);
            }
            let newNeighbourWidth = this.resizeUtils.getAcceptedColumnWidth(
                (this.resizeUtils.getColumnWidth(movePosition.affectedColumn) -
                    oldWidth).toString(),
            );
            let newNeighbour = movePosition.affectedColumn;
            let totalWidthAdjusted = 0;
            updateColumnWidth(column, oldWidth);
            while (true) {
                // take width from all neighbours in one direction till the entire width is obtained
                if (newNeighbourWidth <= 0) {
                    newNeighbourWidth = this.resizeUtils.getSmallestColumnWidth();
                    const originalWidthOfNeighbour = this.resizeUtils.getColumnWidth(newNeighbour);
                    updateColumnWidth(newNeighbour, newNeighbourWidth);
                    totalWidthAdjusted += (originalWidthOfNeighbour - newNeighbourWidth);
                } else {
                    updateColumnWidth(newNeighbour, newNeighbourWidth);
                    break;
                }

                if (direction === "+1") {
                    newNeighbour = getAdjacentColumn(newNeighbour, "+1");
                } else {
                    newNeighbour = getAdjacentColumn(newNeighbour, "-1");
                }

                if (!newNeighbour) {
                    updateColumnWidth(column, totalWidthAdjusted);
                    break;
                }
                const neighbourExistingWidth = this.resizeUtils.getColumnWidth(newNeighbour);
                newNeighbourWidth = neighbourExistingWidth - (oldWidth - totalWidthAdjusted);
                if (newNeighbourWidth < 0.001) {
                    newNeighbourWidth = 0;
                }

            }
            let totalWidth = 0;
            this.contentType.children().forEach((columnChild: ContentTypeCollectionInterface<ColumnPreview>) => {
                totalWidth += this.resizeUtils.getColumnWidth(columnChild);
            });
            if (totalWidth > 100) {
                // take extra width from newly moved column
                updateColumnWidth(column, this.resizeUtils.getColumnWidth(column) - (totalWidth - 100));
            }
        }

    }

    /**
     * Init the resizing events on the group
     *
     * @param {JQuery} line
     */
    private initMouseMove(line: JQuery): void {
        let intersects: boolean = false;
        $(document).on("mousemove touchmove", (event: JQueryEventObject) => {
            if (line.parents(hiddenClass).length > 0) {
                return;
            }

            const linePosition = this.getLinePosition(line);

            // If we're handling a touch event we need to pass through the page X & Y
            if (event.type === "touchmove") {
                event.pageX = (event.originalEvent as any).pageX;
                event.pageY = (event.originalEvent as any).pageY;
            }

            if (this.eventIntersectsLine(event, linePosition)) {
                intersects = true;
                // @todo re-instate onResizingMouseMove
                this.onResizingMouseMove(event, line, linePosition);
                this.onDraggingMouseMove(event, line, linePosition);
                this.onDroppingMouseMove(event, line, linePosition);
            } else {
                intersects = false;
                this.linePositionCache = null;
                this.dropPosition = null;
                this.dropPlaceholder.removeClass("left right");
                this.columnLineDropPlaceholder.removeClass("active");
                this.columnLineBottomDropPlaceholder.removeClass("active");
                this.columnLineBottomDropPlaceholder.hide();
                this.columnLineDropPlaceholder.hide();
                // @todo combine active and show/hide functionality for columnLineDropPlaceholder
              //  this.movePlaceholder.css("left", "").removeClass("active");
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
                line.find(".ui-sortable").each(function() {
                    if ($(this).data("ui-sortable")) {
                        $(this).sortable("option", "disabled", false);
                    }
                });
            });
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
        this.linePositionCache = null;
        this.dropPosition = null;
        this.dropPlaceholder.removeClass("left right");
        this.columnLineDropPlaceholder.removeClass("active");
        this.columnLineBottomDropPlaceholder.removeClass("active");
        this.columnLineBottomDropPlaceholder.hide();
        this.columnLineDropPlaceholder.hide();
        this.resizing(false);
        this.resizeMouseDown = null;
        this.resizeLeftLastColumnShrunk = this.resizeRightLastColumnShrunk = null;
        this.dropPositions = [];

        this.unsetResizingColumns();

        // Change the cursor back
        $("body").css("cursor", "");

        this.movePlaceholder.css("left", "").removeClass("active");
        this.resizeGhost.removeClass("active");

        // Reset the line positions cache
        this.linePositionCache = null;
    }

    /**
     * Handle the mouse up action, either adding a new column or moving an existing
     */
    private handleMouseUp(): void {

        const self = this;
        const dragColumn = getDragColumn();
        if ((this.columnLineDropPlaceholder.hasClass("active")
            || this.columnLineBottomDropPlaceholder.hasClass("active"))
        && !dragColumn) {

            createColumnLine(
                this.contentType.parentContentType,
                this.resizeUtils.getSmallestColumnWidth(),
                this.getNewColumnLineIndex(),
            ).then((columnLine) => {
                events.trigger(
                    columnLine.config.name + ":dropAfter",
                    {id: columnLine.id, columnLine},
                );
            });
            return;
        }

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

        if (this.isColumnBeingMovedToAnotherColumnLine()) {
            this.onExistingColumnDrop(this.movePosition);
        }

    }

    /**
     * Does the current event intersect with the line?
     *
     * @param {JQueryEventObject} event
     * @param {LinePositionCache} groupPosition
     * @returns {boolean}
     */
    private eventIntersectsLine(event: JQueryEventObject, groupPosition: LinePositionCache): boolean {
        return event.pageY > groupPosition.top &&
            event.pageY < (groupPosition.top + groupPosition.outerHeight) &&
            event.pageX > groupPosition.left &&
            event.pageX < (groupPosition.left + groupPosition.outerWidth);
    }

    /**
     * Handle a column being dragged around the group
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} line
     * @param {LinePositionCache} linePosition
     */
    private onDraggingMouseMove(event: JQueryEventObject, line: JQuery, linePosition: LinePositionCache): void {
        const dragColumn = getDragColumn();
        if (dragColumn) {
            // If the drop positions haven't been calculated for this line do so now
            if (this.dropPositions.length === 0) {
                this.dropPositions = calculateDropPositions(this.contentType);
            }

            const columnInstance = dragColumn;
            const currentX = event.pageX - linePosition.left;

            // Are we within the same column line or have we ended up over another?
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

                if (this.movePosition &&
                    (!this.isNewLinePlaceDropPlaceholderVisible(event, linePosition)
                        && !this.isNewLineBottomPlaceDropPlaceholderVisible(event, linePosition))) {
                    this.dropPlaceholder.removeClass("left right");
                    this.movePlaceholder.css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        right: (this.movePosition.placement === "right"
                            ? linePosition.width - this.movePosition.right : ""),
                        width: dragColumn.preview.element.outerWidth() + "px",
                    }).addClass("active");
                } else {
                    this.movePlaceholder.removeClass("active");
                }
            } else {
                // If we're moving to another column line we utilise the existing drop placeholder
                this.movePosition = this.dropPositions.find((position) => {
                    return currentX > position.left && currentX <= position.right && position.canShrink;
                });

                if (this.movePosition && !this.isNewLinePlaceDropPlaceholderVisible(event, linePosition)) {
                    const classToRemove = (this.movePosition.placement === "left" ? "right" : "left");
                    this.movePlaceholder.removeClass("active");
                    this.dropPlaceholder.removeClass(classToRemove).css({
                        left: (this.movePosition.placement === "left" ? this.movePosition.left : ""),
                        right: (this.movePosition.placement === "right" ?
                                linePosition.width - this.movePosition.right : ""
                        ),
                        width: linePosition.width / this.resizeUtils.getGridSize() + "px",
                    }).addClass(this.movePosition.placement);
                } else {
                    this.dropPlaceholder.removeClass("left right");
                }
            }
        }
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
     *
     * @param event
     * @param linePosition
     * @private
     */
    private isNewLinePlaceDropPlaceholderVisible(event: JQueryEventObject, linePosition: LinePositionCache): boolean {

        const siblings = this.contentType.parentContentType.children();
        const id = this.contentType.id;
        let index = 0;
        siblings.forEach((columnLine) => {
            if (columnLine.id === id){
                return false;
            }
            index++;
        });
        const draggedColumn = getDragColumn();
        // show column line drop placeholder only for top column line in a group

        return (this.dropOverElement || draggedColumn) &&
            event.pageY > linePosition.top + 15 &&
            event.pageY < linePosition.top + 15 + this.lineDropperHeight;
    }

    /**
     *
     * @param event
     * @param linePosition
     * @private
     */
    private isNewLineBottomPlaceDropPlaceholderVisible(
        event: JQueryEventObject,
        linePosition: LinePositionCache,
    ): boolean {

        const draggedColumn = getDragColumn();
        return (this.dropOverElement || draggedColumn) &&
            (event.pageY < linePosition.top + 15 + this.element.outerHeight() &&
                event.pageY > linePosition.top + 15 + this.element.outerHeight() - this.lineDropperHeight);

    }

    /**
     *
     * @param event
     * @param linePosition
     * @private
     */
    private isNewColumnDropPlaceholderVisible(event: JQueryEventObject, linePosition: LinePositionCache): boolean {

        const draggedColumn = getDragColumn();
        return (this.dropOverElement || draggedColumn) &&
        event.pageY > linePosition.top + 15 + this.lineDropperHeight &&
        event.pageY < linePosition.top + 15 + linePosition.outerHeight - this.lineDropperHeight;
    }
    /**
     * Handle mouse move events on when dropping elements
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} line
     * @param {LinePositionCache} linePosition
     */
    private onDroppingMouseMove(event: JQueryEventObject, line: JQuery, linePosition: LinePositionCache): void {
        const elementChildrenParent = line.parents(".element-children");
        // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly
        if (this.isNewLinePlaceDropPlaceholderVisible(event, linePosition)) {
            this.dropPosition = null;
            this.dropPlaceholder.removeClass("left right");
            this.columnLineDropPlaceholder.addClass("active");
            this.columnLineDropPlaceholder.show();
            return this.handleLineDropMouseMove(event, line, linePosition);
        } else if (this.isNewLineBottomPlaceDropPlaceholderVisible(event, linePosition)) {
            this.dropPosition = null;
            this.dropPlaceholder.removeClass("left right");
            this.columnLineBottomDropPlaceholder.addClass("active");
            this.columnLineBottomDropPlaceholder.show();
            return this.handleLineDropMouseMove(event, line, linePosition);
        }
        else if (this.dropOverElement) {
            this.columnLineDropPlaceholder.hide();
            this.columnLineBottomDropPlaceholder.hide();
            this.columnLineBottomDropPlaceholder.removeClass("active");
            this.columnLineDropPlaceholder.removeClass("active");

        }
        if (this.isNewColumnDropPlaceholderVisible(event, linePosition)) {
            this.columnLineDropPlaceholder.hide();
            this.columnLineDropPlaceholder.removeClass("active");
            this.columnLineBottomDropPlaceholder.hide();
            this.columnLineBottomDropPlaceholder.removeClass("active");
            return this.handleColumnDropMouseMove(event, line, linePosition);
        }
    }

    /**
     *
     * @param event
     * @param line
     * @param linePosition
     * @private
     */
    private handleLineDropMouseMove(event: JQueryEventObject, line: JQuery, linePosition: LinePositionCache): void {
        const elementChildrenParent = line.parents(".element-children");
        // Disable the column line sortable instance
        // Disable the column group sortable instance
        if (elementChildrenParent.data("ui-sortable")) {
            elementChildrenParent.sortable("option", "disabled", true);
        }
    }

    /**
     *
     * @param event
     * @param line
     * @param linePosition
     * @private
     */
    private handleColumnDropMouseMove(event: JQueryEventObject, line: JQuery, linePosition: LinePositionCache): void {
        const elementChildrenParent = line.parents(".element-children");
        // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly
        if (
            this.dropOverElement &&
            event.pageY > linePosition.top + 50 &&
            event.pageY < (linePosition.top + linePosition.outerHeight) - 50
        ) {
            // Disable the column line sortable instance
            if (elementChildrenParent.data("ui-sortable")) {
                elementChildrenParent.sortable("option", "disabled", true);
            }

            const currentX = event.pageX - linePosition.left;
            this.dropPosition = this.dropPositions.find((position) => {
                return currentX > position.left && currentX <= position.right && position.canShrink;
            });

            if (this.dropPosition) {
                this.dropPlaceholder.removeClass("left right").css({
                    left: (this.dropPosition.placement === "left" ? this.dropPosition.left : ""),
                    right:
                        (this.dropPosition.placement === "right" ? linePosition.width - this.dropPosition.right : ""),
                    width: linePosition.width / this.resizeUtils.getGridSize() + "px",
                }).addClass(this.dropPosition.placement);
            }
        } else if (this.dropOverElement) {
            // Re-enable the column group sortable instance
            if (elementChildrenParent.data("ui-sortable")) {
                elementChildrenParent.sortable("option", "disabled", false);
            }
            this.dropPosition = null;
            this.dropPlaceholder.removeClass("left right");
        }

    }

    /**
     * Cache the groups positions
     *
     * @param {JQuery} line
     * @returns {}
     */
    private getLinePosition(line: JQuery): LinePositionCache{
        if (!this.linePositionCache) {
            this.linePositionCache = {
                top: line.offset().top,
                left: line.offset().left,
                width: line.width(),
                height: line.height(),
                outerWidth: line.outerWidth(),
                outerHeight: line.outerHeight(),
            };
        }

        return this.linePositionCache;
    }

    /**
     * Init the droppable functionality for new columns
     *
     * @param {JQuery} line
     */
    private initDroppable(line: JQuery): void {
        const self = this;
        let headStyles: HTMLStyleElement;

        line.droppable({
            deactivate() {
                self.dropOverElement = null;
                self.dropPlaceholder.removeClass("left right");

                _.defer(() => {
                    // Re-enable the column group sortable instance & all children sortable instances
                    line.parents(".element-children").each(function() {
                        if ($(this).data("ui-sortable")) {
                            $(this).sortable("option", "disabled", false);
                        }
                    });
                });
            },
            activate() {
                if (getDraggedContentTypeConfig() === Config.getContentTypeConfig("column-group")) {
                    line.find(".ui-sortable").each(function() {
                        if ($(this).data("ui-sortable")) {
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
                // Is the element currently being dragged a column group?
                if (getDraggedContentTypeConfig() === Config.getContentTypeConfig("column-group") ||
                    getDraggedContentTypeConfig() === Config.getContentTypeConfig("column")) {
                    // Always calculate drop positions when an element is dragged over
                    const ownContentType = self.contentType as ContentTypeCollectionInterface<ColumnLinePreview>;
                    self.dropPositions = calculateDropPositions(ownContentType);

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
     * Register a resize handle within a child column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {JQuery} handle
     */
    private registerResizeHandle(column: ContentTypeCollectionInterface<ColumnPreview>, handle: JQuery) {
        handle.off("mousedown touchstart");
        handle.on("mousedown touchstart", (event) => {
            event.preventDefault();
            const groupPosition = this.getLinePosition(this.element);
            this.resizing(true);

            // @ts-ignore
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
     * Add Columns to the current Column Line
     *
     * @returns {Promise<ContentTypeCollectionInterface>}
     */
    private createColumns(): void {
        const defaultGridSize = getDefaultGridSize();
        const col1Width = (Math.ceil(defaultGridSize / 2) * 100 / defaultGridSize).toFixed(
            Math.round(100 / defaultGridSize) !== 100 / defaultGridSize ? 8 : 0,
        );

        Promise.all([
            createContentType(
                Config.getContentTypeConfig("column"),
                this.contentType,
                this.contentType.stageId,
                {width: col1Width + "%"},
            ),
            createContentType(
                Config.getContentTypeConfig("column"),
                this.contentType,
                this.contentType.stageId,
                {width: (100 - parseFloat(col1Width)) + "%"},
            ),
        ]).then(
            (columns: [ContentTypeCollectionInterface<Preview>, ContentTypeCollectionInterface<Preview>]) => {
                this.contentType.addChild(columns[0], 0);
                this.contentType.addChild(columns[1], 1);
                this.fireMountEvent(this.contentType, columns[0], columns[1]);
            },
        );
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
     * Handle a column being resized
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} width
     * @param {ContentTypeCollectionInterface<ColumnPreview>} adjustedColumn
     */
    private onColumnResize(
        column: ContentTypeCollectionInterface<ColumnPreview>,
        width: number,
        adjustedColumn: ContentTypeCollectionInterface<ColumnPreview>,
    ) {
        this.resizeUtils.resizeColumn(column, width, adjustedColumn);
    }

    /**
     * Fire the mount event for content types
     *
     * @param {ContentTypeInterface[]} contentTypes
     */
    private fireMountEvent(...contentTypes: ContentTypeInterface[]) {
        contentTypes.forEach((contentType) => {
            events.trigger("contentType:mountAfter", {id: contentType.id, contentType});
            events.trigger(contentType.config.name + ":mountAfter", {id: contentType.id, contentType});
        });
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

    private getNewColumnLineIndex(): number {
        let index = -1;
        const self = this;
        for (const child of this.contentType.parentContentType.children()) {
            index++;
            if (child.id === self.contentType.id) {
                break;
            }
        }
        if (this.columnLineBottomDropPlaceholder.hasClass("active")) {
            // show the bottom drop placeholder
            index++;
        }
        return index;
    }

    private isColumnBeingMovedToAnotherColumnLine(): boolean {
        const column = getDragColumn();
        if (!column) {
            // if no move position, column is not being moved.
            return false;
        }

        if (column.parentContentType !== this.contentType) {
            // if the parent content type is not same as this column line, column is being moved to new column line
            return true;
        }

        if (column.parentContentType === this.contentType
            && (this.columnLineDropPlaceholder.hasClass("active")
                 || this.columnLineBottomDropPlaceholder.hasClass("active"))) {
            // since new column line drop placeholder is visible, column move should introduce a new column line
            return true;
        }

        return false;
    }
}
