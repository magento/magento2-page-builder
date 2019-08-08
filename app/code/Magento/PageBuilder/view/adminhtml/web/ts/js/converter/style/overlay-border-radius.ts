/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import ConverterInterface from "../converter-interface";

/**
 * Takes difference of border width from border radius to conform snugly to edges of wrapper border
 *
 * @api
 */
export default class OverlayBorderRadius implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    public fromDom(value: string): string | object {
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string | object {
        const borderRadius = data.border_radius ? parseInt(data.border_radius as string, 10) : 0;
        const borderWidth = data.border_width ? parseInt(data.border_width as string, 10) : 0;

        if (borderRadius <= borderWidth) {
            return "0";
        }

        return (borderRadius - borderWidth) + "px";
    }
}
