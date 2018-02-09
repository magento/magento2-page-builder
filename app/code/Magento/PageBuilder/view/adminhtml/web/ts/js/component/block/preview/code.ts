/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import hljs from "pagebuilder/highlight";
import {Dictionary} from "underscore";
import Appearance from "../../appearance/appearance";
import Block from "../block";
import PreviewBlock from "./block";

export default class Code extends PreviewBlock {

    /**
     * @param {Block} parent
     * @param {object} config
     * @param {Appearance} appearance
     */
    constructor(parent: Block, config: object, appearance: Appearance) {
        super(parent, config, appearance);
        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                this.updateDataValue("html", hljs.highlight("html", this.data.snippet()).value);
            },
            this.parent.id,
        );
    }
}
