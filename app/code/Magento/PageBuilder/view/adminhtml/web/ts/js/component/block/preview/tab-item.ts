/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewCollection from "../../../preview-collection";
import {Options} from "../../stage/structural/options";

export default class TabItem extends PreviewCollection {

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        options.removeOption("title");
        return options;
    }
}
