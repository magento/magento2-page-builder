/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface, {ConverterConfigInterface, ConverterDataInterface} from "./converter-interface";

export default class EmptyMobileImage implements ConverterInterface {
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {object} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const desktopImage = data[config.desktop_image_variable];
        const mobileImage = data[config.mobile_image_variable];
        if (mobileImage && desktopImage
            && mobileImage[0] !== undefined && desktopImage[0] !== undefined
            && mobileImage[0].url === desktopImage[0].url
        ) {
            delete data[config.mobile_image_variable];
        }
        return data;
    }

    /**
     * Process data before it's converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {object} config
     * @returns {object}
     */
    public toDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        if (data[config.mobile_image_variable] === undefined
            || data[config.mobile_image_variable][0] === undefined
        ) {
            data[config.mobile_image_variable] = data[config.desktop_image_variable];
        }
        return data;
    }
}
