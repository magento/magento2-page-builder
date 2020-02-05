/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {get, set} from "../utils/object";
import ConverterInterface, {ConverterConfigInterface, ConverterDataInterface} from "./converter-interface";

export default class BackgroundType implements ConverterInterface {
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): ConverterDataInterface {
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
        const   backgroundType = get(data, config.attribute_name);

        if (backgroundType === 'video') {
            set(data, "background_image", []);
            set(data, "mobile_image", []);
        } else if (backgroundType === 'image') {
            set(data, "video_source", "");
            set(data, "video_fallback_image", []);
            set(data, "video_overlay_color", "");
        }

        return data;
    }
}
