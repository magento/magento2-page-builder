/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import hljs from "pagebuilder/highlight";
import {Dictionary} from "underscore";
import Block from "../block";
import PreviewBlock from "./block";

export default class Code extends PreviewBlock {
    /**
     * Constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                this.updateDataValue("html", hljs.highlight("html", this.data.snippet()).value);
            },
            this.parent.id,
        );
    }
}
