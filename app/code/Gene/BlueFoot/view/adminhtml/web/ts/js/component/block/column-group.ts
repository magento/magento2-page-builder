/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Block from "./block";
import ko from "knockout";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {ConfigContentBlock} from "../config";
import Appearance from "../appearance/appearance";

const MAX_COLUMNS = 6;

export default class ColumnGroup extends Block {
    resizing: KnockoutObservable<boolean> = ko.observable(false);

    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, formData, appearance);

        this.on('blockRemoved', this.spreadWidth.bind(this));
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
}

