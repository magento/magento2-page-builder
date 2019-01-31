/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ImageArrayObject from "../converter/image-array-object.types";
import {get, set} from "../utils/object";
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
        const desktopImage = get<ImageArrayObject>(data, config.desktop_image_variable);
        const mobileImage = get<ImageArrayObject>(data, config.mobile_image_variable);
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
        const mobileImage = get<ImageArrayObject>(data, config.mobile_image_variable);
        if (mobileImage === undefined
            || mobileImage[0] === undefined
        ) {
            set(data, config.mobile_image_variable, get(data, config.desktop_image_variable));
        }
        return data;
    }
}
