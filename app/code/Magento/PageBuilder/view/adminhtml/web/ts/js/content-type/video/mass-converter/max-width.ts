/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ConverterInterface} from "../../../mass-converter/converter-interface";

export default class MaxWidth implements ConverterInterface {
    private ratioNumerator = 16;
    private ratioDenominator = 9;

    /**
     * Convert value to internal format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public fromDom(data: object, config: object): object {
        return data;
    }

    /**
     * Convert value to knockout format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public toDom(data: object, config: object): object {
        const specifiedWidth = (data[config.max_width_variable] || '').replace('px', '');
        const specifiedHeight = (data[config.max_height_variable] || '').replace('px', '');

        if (specifiedWidth && !specifiedHeight) {
            data[config.max_width_variable] = specifiedWidth + "px";
        }
        else if (!specifiedWidth && specifiedHeight) {
            // Calculate the max width that would create the max height
            data[config.max_width_variable] = <string>specifiedHeight / this.ratioDenominator * this.ratioNumerator + "px";
        }
        else if (specifiedWidth && specifiedHeight) {
            // The max height won't be met with the supplied width
            if (specifiedWidth / this.ratioNumerator * this.ratioDenominator < specifiedHeight) {
                data[config.max_width_variable] = <string>specifiedWidth + "px";
            }
            else {
                // Calculate the max width that would create the max height
                data[config.max_width_variable] =  <string>specifiedHeight / this.ratioDenominator * this.ratioNumerator + "px";
            }
        }

        return data;
    }
}