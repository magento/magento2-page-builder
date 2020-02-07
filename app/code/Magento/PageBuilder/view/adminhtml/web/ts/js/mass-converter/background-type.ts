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
        const backgroundType = get<string>(data, config.attribute_name);

        if (backgroundType === "video") {
            set(data, config.desktop_image_variable, []);
            set(data, config.mobile_image_variable, []);
        } else if (backgroundType === "image") {
            set(data, config.video_source_variable, null);
            set(data, config.video_fallback_image_variable, []);
            set(data, config.video_overlay_color_variable, "");
        }

        return data;
    }
}
