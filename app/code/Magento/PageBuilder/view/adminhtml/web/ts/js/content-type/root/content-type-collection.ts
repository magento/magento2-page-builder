/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import alertDialog from "Magento_Ui/js/modal/alert";
import ContentTypeCollection from "../../content-type-collection";
import ContentTypeConfigInterface from "../../content-type-config";
import RootPreview from "./preview";

/**
 * @api
 */
export default class RootContainer extends ContentTypeCollection {
    public preview: RootPreview = new RootPreview(this, this.config, null);

    /**
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    constructor(
        config: ContentTypeConfigInterface,
        stageId: string,
    ) {
        super(null, config, stageId);
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        if (this.getChildren().length === 1) {
            alertDialog({
                content: $t("You are not able to remove the final row from the content."),
                title: $t("Unable to Remove"),
            });
            return;
        }
        super.removeChild(child);
    }

    /**
     * Determine if the container can receive drop events?
     *
     * @returns {boolean}
     */
    public isContainer() {
        return true;
    }

    /**
     * Retrieve the preview template from the config
     *
     * @returns {string}
     */
    get previewTemplate(): string {
        return this.config.preview_template;
    }

    /**
     * Bind associated events
     */
    protected bindEvents() {

    }
}
