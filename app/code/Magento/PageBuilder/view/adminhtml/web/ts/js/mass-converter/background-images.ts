/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {decodeUrl, urlToDirective} from "../utils/image";
import ConverterInterface, {ConverterConfigInterface, ConverterDataInterface} from "./converter-interface";

export default class BackgroundImages implements ConverterInterface {
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const directive = data[config.attribute_name];
        if (directive) {
            const images = JSON.parse(directive.replace(/\\(.)/mg, "$1")) || {};
            if (typeof images.desktop_image !== "undefined") {
                data[config.desktop_image_variable] = decodeUrl(images.desktop_image);
            }
            if (typeof images.mobile_image !== "undefined") {
                data[config.mobile_image_variable] = decodeUrl(images.mobile_image);
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
    public toDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const directiveData: {
            desktop_image?: string,
            mobile_image?: string,
        } = {};

        if (typeof data[config.desktop_image_variable] !== "undefined"
            && data[config.desktop_image_variable]
            && typeof data[config.desktop_image_variable][0] !== "undefined"
        ) {
            directiveData.desktop_image = urlToDirective(data[config.desktop_image_variable][0].url);
        }

        if (typeof data[config.mobile_image_variable] !== "undefined"
            && data[config.mobile_image_variable]
            && typeof data[config.mobile_image_variable][0] !== "undefined"
        ) {
            directiveData.mobile_image = urlToDirective(data[config.mobile_image_variable][0].url);
        }

        // Add the directive data, ensuring we escape double quotes
        data[config.attribute_name] = JSON.stringify(directiveData)
            .replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");

        return data;
    }
}
