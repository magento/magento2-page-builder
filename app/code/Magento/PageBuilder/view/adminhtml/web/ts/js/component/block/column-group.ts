/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import events from "uiEvents";
import _ from "underscore";
import {moveArrayItem} from "../../utils/array";
import {ConfigContentBlock} from "../config";
import Stage from "../stage";
import Structural from "../stage/structural/abstract";
import EditableArea from "../stage/structural/editable-area";
import Block from "./block";
import Column from "./column";
import {createColumn} from "./column-group/factory";
import {resizeColumn, updateColumnWidth} from "./column-group/resizing";
import {default as ColumnGroupPreview} from "./preview/column-group";
import {DropPosition} from "./preview/column-group/dragdrop";
import {getDragColumn} from "./preview/column-group/registry";
import {
    findShrinkableColumn, getAcceptedColumnWidth, getAdjacentColumn, getColumnIndexInGroup, getColumnsWidth,
    getColumnWidth, getMaxColumns, getRoundedColumnWidth, getSmallestColumnWidth,
} from "./preview/column-group/resizing";

export default class ColumnGroup extends Block {

    /**
     * @param {EditableArea} parent
     * @param {Stage} stage
     * @param {ConfigContentBlock} config
     * @param formData
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any) {
        super(parent, stage, config, formData);

        events.on("block:removed", (event, args: BlockRemovedParams) => {
            if (args.parent.id === this.id) {
                this.spreadWidth(event, args);
            }
        });

        // Listen for resizing events from child columns
        events.on("column:bindResizeHandle", (event, args) => {
            // Does the events parent match the previews parent? (e.g. column group)
            if (params.parent.id === this.id) {
                (this.preview as ColumnGroupPreview).registerResizeHandle(args.column, args.handle);
            }
        });
        events.on("column:initElement", (event, args) => {
            // Does the events parent match the previews parent? (e.g. column group)
            if (args.parent.id === this.id) {
                (this.preview as ColumnGroupPreview).bindDraggable(args.column);
            }
        });

        this.children.subscribe(
            _.debounce(
                this.removeIfEmpty.bind(this),
                50,
            ),
        );
    }

    /**
     * Duplicate a child of the current instance
     *
     * @param {Column} child
     * @param {boolean} autoAppend
     * @returns {Structural|Undefined}
     */
    public duplicateChild(child: Column, autoAppend: boolean = true): Structural | void {
        // Are we duplicating from a parent?
        if (this.children().length === 0
            || (this.children().length > 0 && getColumnsWidth(this) < 100)
        ) {
            return super.duplicateChild(child, autoAppend);
        }

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
            alertDialog({
                content: $t("There is no free space within the column group to perform this action."),
                title: $t("Unable to duplicate column"),
            });
        } else {
            return duplicate;
        }
    }

    /**
     * Handle a new column being dropped into the group
     *
     * @param {Event} event
     * @param {JQueryUI.DroppableEventUIParam} ui
     * @param {DropPosition} dropPosition
     */
    public onNewColumnDrop(event: Event, ui: JQueryUI.DroppableEventUIParam, dropPosition: DropPosition) {
        event.preventDefault();
        event.stopImmediatePropagation();

        // Create our new column
        createColumn(
            this,
            getSmallestColumnWidth(),
            dropPosition.insertIndex,
        ).then(() => {
            const newWidth = getAcceptedColumnWidth(
                (getColumnWidth(dropPosition.affectedColumn) - getSmallestColumnWidth()).toString(),
            );
            // Reduce the affected columns width by the smallest column width
            updateColumnWidth(dropPosition.affectedColumn, newWidth);
        });
    }

    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {Event} event
     * @param {DropPosition} movePosition
     */
    public onExistingColumnDrop(event: Event, movePosition: DropPosition) {
        const column: Column = getDragColumn();
        let modifyOldNeighbour;
        event.preventDefault();
        event.stopImmediatePropagation();

        // Determine which old neighbour we should modify
        const oldWidth = getColumnWidth(column);

        // Retrieve the adjacent column either +1 or -1
        if (getAdjacentColumn(column, "+1")) {
            modifyOldNeighbour = getAdjacentColumn(column, "+1");
        } else if (getAdjacentColumn(column, "-1")) {
            modifyOldNeighbour = getAdjacentColumn(column, "-1");
        }

        // Set the column to it's smallest column width
        updateColumnWidth(column, getSmallestColumnWidth());

        column.parent.removeChild(column);
        events.trigger("block:instanceDropped", {
            blockInstance: column,
            index: movePosition.insertIndex,
            parent: this,
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
            (getColumnWidth(movePosition.affectedColumn) - getSmallestColumnWidth()).toString(),
        );

        // Reduce the affected columns width by the smallest column width
        updateColumnWidth(movePosition.affectedColumn, newNeighbourWidth);
    }

    /**
     * Handle a column being sorted into a new position in the group
     *
     * @param {Column} column
     * @param {number} newIndex
     */
    public onColumnSort(column: Column, newIndex: number) {
        const currentIndex = getColumnIndexInGroup(column);
        if (currentIndex !== newIndex) {
            if (currentIndex < newIndex) {
                // As we're moving an array item the keys all reduce by 1
                --newIndex;
            }
            moveArrayItem(this.children, currentIndex, newIndex);
        }
    }

    /**
     * Handle a column being resized
     *
     * @param {Column} column
     * @param {number} width
     * @param {Column} adjustedColumn
     */
    public onColumnResize(column: Column, width: number, adjustedColumn: Column) {
        resizeColumn(column, width, adjustedColumn);
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

interface BlockRemovedParams {
    parent: ColumnGroup;
    block: Column;
    index: number;
}
