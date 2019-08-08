/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import MassConverterInterface, {
    ConverterConfigInterface,
    ConverterDataInterface,
} from "../../../mass-converter/converter-interface";
import {get} from "../../../utils/object";

export default class HeaderAlignment implements MassConverterInterface {

    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        return data;
    }

    /**
     * Add our tab alignment class into the data for the tabs
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    public toDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        data.css_classes += " tab-align-" + get(data, config.navigation_alignment_variable, "left");
        return data;
    }
}
