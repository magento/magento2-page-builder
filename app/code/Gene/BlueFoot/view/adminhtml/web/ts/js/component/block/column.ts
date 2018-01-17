/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {moveArrayItemIntoArray} from "../../utils/array";

// Temporary variable until we determine how we'll implement this
const MAX_COLUMNS = 6;

import Block from "./block";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {default as Config, ConfigContentBlock} from "../config";
import Appearance from "../appearance/appearance";
import createBlock from "./factory";
import $ from "jquery";
import _ from "underscore";

export default class Column extends Block {
    /**
     * Constructor
     *
     * @param {EditableArea} parent
     * @param {Stage} stage
     * @param {ConfigContentBlock} config
     * @param formData
     * @param {Appearance} appearance
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, formData, appearance);

        this.on('blockReady', this.blockReady.bind(this));
    }

    /**
     * Once a new block has been added check to see if we're inserting a new group, or just a new column
     */
    public blockReady() {
        if (this.isNewGroup()) {
            this.wrapInColumnGroup();
        }
    }

    /**
     * Create a column group and insert the added column
     */
    private wrapInColumnGroup() {
        createBlock(Config.getContentTypeConfig('column-group'), this.parent, this.stage).then((colGroup) => {
            this.parent.addChild(colGroup);
            // For speed on this prototype just create new columns, moving the existing one is problematic currently
            this.parent.removeChild(this);

            // Add our additional second column
            createBlock(this.config, parent, this.stage, {width: '33.33333333%'}).then((column) => {
                colGroup.addChild(column);
            });
            createBlock(this.config, parent, this.stage, {width: '33.33333333%'}).then((column) => {
                colGroup.addChild(column);
            });
            createBlock(this.config, parent, this.stage, {width: '33.33333333%'}).then((column) => {
                colGroup.addChild(column);
            });
        });
    }

    /**
     * Is the column being added going to become a new group?
     *
     * @returns {boolean}
     */
    private isNewGroup() {
        const parentChildren = this.parent.getChildren(),
            currentIndex = parentChildren().indexOf(this);

        // Are there items either side of the column?
        if (typeof parentChildren()[currentIndex - 1] !== 'undefined') {
            return !(parentChildren()[currentIndex - 1] instanceof Column);
        }
        if (typeof parentChildren()[currentIndex + 1] !== 'undefined') {
            return !(parentChildren()[currentIndex + 1] instanceof Column);
        }

        return true;
    }

    /**
     * Resize the current column
     *
     * @param currentNewWidth
     */
    private resizeColumns(currentNewWidth) {
        const current = this.stage.store.get(this.id).width,
            difference = (parseFloat(currentNewWidth) - parseFloat(current)).toFixed(8);

        // Don't run the update if we've already modified the column
        if (parseFloat(current) === parseFloat(currentNewWidth)) {
            return;
        }

        this.stage.store.updateKey(
            this.id,
            currentNewWidth,
            'width'
        );

        if (difference) {
            this.resizeAdjacentColumn(difference);
        }
    }

    /**
     * Resize the adjacent column to the current
     *
     * @param difference
     */
    private resizeAdjacentColumn(difference) {
        const parentChildren = this.parent.getChildren(),
            currentIndex = parentChildren().indexOf(this);
        if (typeof this.parent.children()[currentIndex + 1] !== 'undefined') {
            const adjacentId = this.parent.children()[currentIndex + 1].id,
                currentAdjacent = this.stage.store.get(adjacentId).width;
            let newWidth = parseFloat(currentAdjacent) + -difference;

            this.stage.store.updateKey(
                adjacentId,
                this.parent.getAcceptedColumnWidth(newWidth) + '%',
                'width'
            );
        }
    }

    /**
     * Init the resize handle and the resize functionality
     *
     * @param handle
     */
    public initResizeHandle(handle) {
        let group: JQuery = $(handle).parents('.bluefoot-column-group'),
            ghost: JQuery = group.find('.resize-ghost'),
            column: JQuery = $(handle).parents('.bluefoot-column'),
            smallestColumn = parseFloat((100 / MAX_COLUMNS).toFixed(
                Math.round((100 / MAX_COLUMNS)) !== (100 / MAX_COLUMNS) ? 8 : 0
            )),
            nextColumn: Column = false,
            isMouseDown = false,
            maxGhostWidth = false,
            widths,
            initialPos,
            currentPos,
            currentCol,
            columnLeft;

        $(handle).mousedown((e) => {
            e.preventDefault();
            this.parent.resizing(true);
            widths = this.determineColumnWidths(column, group);
            columnLeft = column.offset().left;
            const parentChildren = this.parent.getChildren(),
                currentIndex = parentChildren().indexOf(this);
            if (typeof this.parent.children()[currentIndex + 1] !== 'undefined') {
                nextColumn = this.parent.children()[currentIndex + 1];
            }
            initialPos = e.pageX;
            maxGhostWidth = false;
            isMouseDown = true;
        });

        group.mousemove((e) => {
            if (isMouseDown) {
                currentPos = e.pageX;

                // Update the ghosts width and position to give a visual indication of the dragging
                let ghostWidth = currentPos - columnLeft;
                if (ghostWidth <= group.width() / MAX_COLUMNS) {
                    ghostWidth = group.width() / MAX_COLUMNS;
                }
                if (ghostWidth >= group.width() - column.position().left) {
                    ghostWidth = group.width() - column.position().left;
                }

                // Make sure the user can't crush the adjacent column smaller than 1/6
                const adjacentWidth = parseFloat(this.stage.store.get(nextColumn.id).width);
                if (adjacentWidth === smallestColumn && ghostWidth > column.width() || maxGhostWidth) {
                    ghostWidth = (maxGhostWidth ? maxGhostWidth : column.width());
                    if (!maxGhostWidth) {
                        maxGhostWidth = column.width();
                    }
                }

                // Reset the max ghost width when the user moves back from the edge
                if (currentPos - columnLeft < column.width()) {
                    maxGhostWidth = false;
                }

                // We take the border width of the width to ensure it's under the mouse exactly
                ghost.width(ghostWidth - 2 + 'px').css('left', column.position().left + 'px');

                if (!maxGhostWidth) {
                    currentCol = _.find(widths, function (val) {
                        if (currentPos > (val.position - 15) && currentPos < (val.position + 15)) {
                            return val;
                        }
                    });

                    if (currentCol) {
                        this.resizeColumns(currentCol.width);
                    }
                }
            }
        }).mouseup(() => {
            this.parent.resizing(false);
            isMouseDown = false;
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
        const columnWidth = group.width() / MAX_COLUMNS,
            groupLeftPos = column.offset().left;
        let columnWidths = [],
            columnLeftPos;

        for (let i = MAX_COLUMNS; i > 0; i--) {
            columnWidths.push({
                position: Math.round(groupLeftPos + columnWidth * i),
                name: i + '/' + MAX_COLUMNS,
                width: (100 / 6 * i).toFixed(
                    Math.round((100 / 6 * i)) !== (100 / 6 * i) ? 8 : 0
                ) + '%'
            });
        }

        return columnWidths;
    }
}
