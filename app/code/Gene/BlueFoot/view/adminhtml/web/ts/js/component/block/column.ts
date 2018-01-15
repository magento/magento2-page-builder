/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import EditableArea from "../stage/structural/editable-area";
import Stage from "../stage";
import {ConfigContentBlock} from "../config";
import Appearance from "../appearance/appearance";
import createBlock from "./factory";

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
            // Ensure the column is 50% width
            this.stage.store.updateKey(
                this.id,
                '50%',
                'width'
            );

            this.appendNewColumn();
        }
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
     * Append a new column directly after the current one
     */
    private appendNewColumn() {
        const parentChildren = this.parent.getChildren(),
            currentIndex = parentChildren().indexOf(this);

        createBlock(this.config, this.parent, this.stage, {width: '50%'}).then((block) => {
            this.parent.addChild(block, currentIndex + 1);
        })
    }
}
