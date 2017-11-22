/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _, {Dictionary} from "underscore";
import hljs from "bluefoot/highlight";
import Block from "../block";
import PreviewBlock from "./block";
import Config from "../../config";

export default class Code extends PreviewBlock {
    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.updateDataValue('html', ko.observable(''));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                this.updateDataValue('html', hljs.highlight('html', this.data.snippet()).value);
            },
            this.parent.id
        );
    }
}