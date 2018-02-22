/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import {Dictionary} from "underscore";
import Config from "../../config";
import PreviewBlock from "./block";

export default class Search extends PreviewBlock {

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();

        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.placeholder() === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    placeholder: this.data.placeholder,
                    role: this.config.name,
                };

                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
                });
            },
            this.parent.id,
        );
    }
}
