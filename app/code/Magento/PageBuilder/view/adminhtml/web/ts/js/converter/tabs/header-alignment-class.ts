/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {DataConverterInterface} from "../data-converter-interface";

export default class HeaderAlignmentClass implements DataConverterInterface {

    /**
     * Process data after it's read and converted by element converters
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public fromDom(data: DataObject, config: object): object {
        return data;
    }

    /**
     * Add our tab alignment class into the data for the tabs
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public toDom(data: DataObject, config: object): object {
        data.css_classes += " tab-align-" + (data[config.navigation_alignment_variable] || "left");
        return data;
    }
}
