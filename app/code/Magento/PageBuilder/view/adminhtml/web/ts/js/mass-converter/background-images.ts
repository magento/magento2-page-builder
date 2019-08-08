/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ImageArrayObject from "../converter/image-array-object.types";
import {decodeUrl, urlToDirective} from "../utils/image";
import {get, set} from "../utils/object";
import ConverterInterface, {ConverterConfigInterface, ConverterDataInterface} from "./converter-interface";

export default class BackgroundImages implements ConverterInterface {
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): ConverterDataInterface {
        const directive = get<string>(data, config.attribute_name);
        if (directive) {
            const images = JSON.parse(directive.replace(/\\(.)/mg, "$1")) || {};
            if (!_.isUndefined(images.desktop_image)) {
                set(data, config.desktop_image_variable, decodeUrl(images.desktop_image));
            }
            if (!_.isUndefined(images.mobile_image)) {
                set(data, config.mobile_image_variable, decodeUrl(images.mobile_image));
            }
            delete data[config.attribute_name];
        }
        return data;
    }

    /**
     * Process data before it's converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    public toDom(data: ConverterDataInterface, config: ConverterConfigInterface): ConverterDataInterface {
        const desktopImage = get<ImageArrayObject>(data, config.desktop_image_variable);
        const mobileImage = get<ImageArrayObject>(data, config.mobile_image_variable);
        const directiveData: {
            desktop_image?: string,
            mobile_image?: string,
        } = {};

        if (!_.isUndefined(desktopImage) && desktopImage && !_.isUndefined(desktopImage[0])) {
            directiveData.desktop_image = urlToDirective(desktopImage[0].url);
        }
        if (!_.isUndefined(mobileImage) && mobileImage && !_.isUndefined(mobileImage[0])) {
            directiveData.mobile_image = urlToDirective(mobileImage[0].url);
        }

        // Add the directive data, ensuring we escape double quotes
        set(
            data,
            config.attribute_name,
            JSON.stringify(directiveData).replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0"),
        );

        return data;
    }
}
