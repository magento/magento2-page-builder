/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Block from "./block";
import $ from "jquery";
import ko from "knockout";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {default as Config, ConfigContentBlock} from "../config";
import Appearance from "../appearance/appearance";
import createBlock from "./factory";

const MAX_COLUMNS = 6;

export default class ColumnGroup extends Block {
    resizing: KnockoutObservable<boolean> = ko.observable(false);
    dropPlaceholder: JQuery;

    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, formData, appearance);

        this.on('blockRemoved', this.spreadWidth.bind(this));
    }

    /**
     * Init the drop placeholder
     *
     * @param element
     */
    public initDropPlaceholder(element) {
        this.dropPlaceholder = $(element);
    }

    /**
     * Init the droppable functionality for new columns
     *
     * @param element
     * @param context
     */
    public initDroppable(element, context) {
        let currentDraggedBlock,
            dropPositions,
            parentX = $(element).offset().left,
            overlayWidth = $(element).width() / 6,
            overElement = false,
            dropPosition,
            parentSortable = $(element).parents('.ui-sortable')[0];

        $(element).droppable({
            greedy: true,
            activate: (event) => {
                currentDraggedBlock = ko.dataFor(event.currentTarget);
            },
            over: (event) => {
                // We need to improve the detection of a column being dragged
                if (currentDraggedBlock.config.name === 'column') {
                    overElement = true;
                    dropPositions = this.calculateDropPositions(element);
                }
            },
            deactivate: () => {
                overElement = false;
                this.dropPlaceholder.removeClass('left right');
            },
            out: () => {
                overElement = false;
                this.dropPlaceholder.removeClass('left right');
            },
            drop: (e) => {
                if (overElement && dropPosition) {
                    overElement = false;

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    // Create our new column
                    createBlock(
                        Config.getContentTypeConfig('column'),
                        this,
                        this.stage,
                        {width: this.getSmallestColumnWidth() + '%'}
                    ).then((column) => {
                        const newWidth = this.getAcceptedColumnWidth(
                            parseFloat(this.stage.store.get(dropPosition.affectedColumn.id).width) - this.getSmallestColumnWidth()
                        );
                        // Reduce the affected columns width by the smallest column width
                        this.stage.store.updateKey(
                            dropPosition.affectedColumn.id,
                            newWidth + '%',
                            'width'
                        );
                        // Add our new column into the container
                        this.addChild(column, dropPosition.insertIndex);
                    });
                }
                this.dropPlaceholder.removeClass('left right');
            }
        }).mousemove((e) => {
            if (overElement) {
                const currentX = e.pageX - parentX;
                dropPosition = dropPositions.find((position) => {
                    if (currentX > position.left && currentX < position.right) {
                        return position;
                    }
                });

                if (dropPosition) {
                    this.dropPlaceholder.removeClass('left right').css({
                        width: overlayWidth + 'px',
                        left: (dropPosition.placement === 'left' ? dropPosition.left : ''),
                        right: (dropPosition.placement === 'right' ? $(element).width() - dropPosition.right : ''),
                    }).addClass(dropPosition.placement);
                }
            }
        });
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
            if (parseFloat(this.stage.store.get(columnData.id).width) > this.getSmallestColumnWidth()) {
                const left = $(column).position().left,
                    width = $(column).width();
                dropPositions.push({
                    left: left,
                    right: left + (width / 2),
                    insertIndex: index,
                    placement: 'left',
                    affectedColumn: columnData
                });
                dropPositions.push({
                    left: left + (width / 2),
                    right: left + width,
                    insertIndex: index + 1,
                    placement: 'right',
                    affectedColumn: columnData
                });
            }
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

        for (let i = MAX_COLUMNS; i > 0; i--) {
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
                const currentWidth = this.stage.store.get(columnToModify.id).width;
                this.stage.store.updateKey(
                    columnToModify.id,
                    parseFloat(currentWidth) + spreadAmount + '%',
                    'width'
                )
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
            return parseFloat(this.stage.store.get(column.id).width);
        }).reduce((widthA, widthB) => {
            return widthA + (widthB ? widthB : 0);
        });
    }

    /**
     * Return the smallest column (%) that we can add
     *
     * @returns {string}
     */
    private getSmallestColumnWidth() {
        return this.getAcceptedColumnWidth(parseFloat(100 / MAX_COLUMNS).toFixed(
            Math.round(100 / MAX_COLUMNS) !== 100 / MAX_COLUMNS ? 8 : 0
        ));
    }

    /**
     * Return an accepted percentage for a column width
     *
     * @param width
     * @returns {number}
     */
    private getAcceptedColumnWidth(width) {
        let newWidth = 0;
        for (let i = MAX_COLUMNS; i > 0; i--) {
            const percentage = parseFloat((100 / MAX_COLUMNS * i).toFixed(
                Math.round((100 / MAX_COLUMNS * i)) !== (100 / MAX_COLUMNS * i) ? 8 : 0
            ));
            // Allow for rounding issues
            if (width > (percentage - 0.1) && width < (percentage + 0.1)) {
                newWidth = percentage;
                break;
            }
        }
        return newWidth;
    }
}

