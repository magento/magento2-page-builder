/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {OptionsInterface} from "../../content-type-menu/option.d";
import {getSortableOptions} from "../../drag-drop/sortable";
import BasePreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class RootPreview extends BasePreviewCollection {
    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */
    public getSortableOptions(): JQueryUI.SortableOptions | any {
        return getSortableOptions(this);
    }

    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */
    get previewTemplate(): string {
        return this.config.preview_template;
    }

    protected bindEvents() {

    }
}
