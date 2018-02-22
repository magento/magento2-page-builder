/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import Block from "./block";
import { Block as BlockInterface } from "./block.d";

export default class Buttons extends Block {

    constructor(parent: EditableArea, stage: Stage, config: Config.ConfigContentBlock, formData: any) {
        super(parent, stage, config, formData);
        // On first drop, automatically add the first button-item child
        this.on("blockReady", _.bind(this.addButton, this));
    }

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createBlockPromise: Promise<BlockInterface> = createBlock(
            Config.getInitConfig("content_types")["button-item"],
            this.parent,
            this.stage,
            {},
        );

        createBlockPromise.then((button: BlockInterface) => {
            this.addChild(button);
            return button;
        }).then(delayedPromise(300)).then((button: BlockInterface) => {
            button.edit.open();
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
