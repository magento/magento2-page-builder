/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import ConverterInterface from "../converter-interface";

export default class OverlayColor implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value === "transparent" ? "" : value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string | object {
        if (data.video_overlay_color) {
            return data.video_overlay_color.toString();
        }

        return "";
    }
}
