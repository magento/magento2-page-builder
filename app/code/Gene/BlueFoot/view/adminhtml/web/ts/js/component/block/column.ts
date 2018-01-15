/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {moveArrayItemIntoArray} from "../../utils/array";

// Temporary variable until we determine how we'll implement this
const MAX_COLUMNS = 6;

const COL_GROUP_CONFIG = {
    component: 'Gene_BlueFoot/js/component/block/column-group',
    preview_component: 'Gene_BlueFoot/js/component/block/preview/column-group',
    preview_template: 'Gene_BlueFoot/component/block/preview/column-group.html',
    render_template: 'Gene_BlueFoot/component/block/render/column-group.html',
    appearances: []
};

import Block from "./block";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {ConfigContentBlock} from "../config";
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
        createBlock(COL_GROUP_CONFIG, this.parent, this.stage).then((colGroup) => {
            this.parent.addChild(colGroup);
            // For speed on this prototype just create new columns
            this.parent.removeChild(this);

            // Add our additional second column
            createBlock(this.config, parent, this.stage, {width: '50%'}).then((column) => {
                colGroup.addChild(column);
            });
            createBlock(this.config, parent, this.stage, {width: '50%'}).then((column) => {
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
        this.stage.store.updateKey(
            this.id,
            currentNewWidth,
            'width'
        );

        if (difference) {
            const parentChildren = this.parent.getChildren(),
                currentIndex = parentChildren().indexOf(this);
            if (typeof this.parent.children()[currentIndex + 1] !== 'undefined') {
                const adjacentId = this.parent.children()[currentIndex + 1].id,
                    current = this.stage.store.get(adjacentId).width;
                this.stage.store.updateKey(
                    adjacentId,
                    parseFloat(current) - difference + '%',
                    'width'
                );
            }
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
            columnLeft = column.offset().left,
            isMouseDown = false,
            widths,
            initialPos,
            currentPos,
            currentCol;

        $(handle).mousedown((e) => {
            e.preventDefault();
            this.parent.resizing(true);
            widths = this.determineColumnWidths(column, group);
            initialPos = e.pageX;
            isMouseDown = true;
        });

        group.mousemove((e) => {
            if (isMouseDown) {
                e.preventDefault();
                currentPos = e.pageX;

                // Update the ghosts width and position to give a visual indication of the dragging
                let ghostWidth = currentPos - columnLeft;
                if (ghostWidth <= group.width() / MAX_COLUMNS) {
                    ghostWidth = group.width() / MAX_COLUMNS;
                }
                if (ghostWidth >= group.width() - column.position().left) {
                    ghostWidth = group.width() - column.position().left;
                }
                ghost.width(ghostWidth + 'px').css('left', column.position().left + 'px');

                currentCol = _.find(widths, function (val) {
                    if (currentPos > (val.position - 15) && currentPos < (val.position + 15)) {
                        return val;
                    }
                });

                if (currentCol) {
                    this.resizeColumns(currentCol.width);
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
