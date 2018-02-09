/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import {Dictionary} from "underscore";
import Config from "../../config";
import PreviewBlock from "./block";

export default class Newsletter extends PreviewBlock {

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();

        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.title() === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    button_text: this.data.button_text,
                    label_text: this.data.label_text,
                    placeholder: this.data.placeholder,
                    role: this.config.name,
                    title: this.data.title,
                };

                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
                });
            },
            this.parent.id,
        );
    }
}
