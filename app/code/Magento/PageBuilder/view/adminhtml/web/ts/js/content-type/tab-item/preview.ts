/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {Options} from "../../component/stage/structural/options";
import PreviewCollection from "../../preview-collection";

export default class Preview extends PreviewCollection {

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
