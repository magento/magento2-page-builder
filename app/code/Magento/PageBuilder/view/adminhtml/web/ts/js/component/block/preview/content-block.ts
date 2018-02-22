/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _, {Dictionary} from "underscore";
import Config from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class ContentBlock extends PreviewBlock {

    /**
     * @param {Block} parent
     * @param {object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (data.identifier === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {identifier: data.identifier, role: this.config.name};
                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
                });
            },
            this.parent.id,
        );
    }
}
