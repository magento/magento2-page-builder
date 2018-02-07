/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import {Dictionary} from "underscore";
import Block from "../block";
import PreviewBlock from "./block";
import {convertMediaDirectivesToUrls} from "../../../utils/directives";

export default class Html extends PreviewBlock {
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
                this.updateDataValue("html", convertMediaDirectivesToUrls(this.data.html()));
            },
            this.parent.id,
        );
    }
}
