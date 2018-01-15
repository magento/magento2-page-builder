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

export default class ColumnGroup extends Block {
    resizing: KnockoutObservable<boolean> = ko.observable(false);

    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, formData, appearance);

        // Remove self if all columns are removed
        this.children.subscribe((children) => {
            if (children.length === 0) {
                this.parent.removeChild(this);
            }
        })
    }
}

