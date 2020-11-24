/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import ConverterInterface from "../converter-interface";

/**
 * Subtract margin from width to ensure adjacent elements do not
 * move or resize when positive or negative margins are present
 *
 * @api
 */
export default class Width implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): object | string {
        if (value.indexOf("calc") !== -1) {
            return value.split("%")[0].split("(")[1] + "%";
        }

        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string {
        if (data[name] && data[name] !== "") {
            const marginsAndPadding = data.margins_and_padding || {};
            const margins = (marginsAndPadding as any).margin || "";
            const marginLeft = margins.left ? parseInt(margins.left as string, 10) : 0;
            const marginRight = margins.right ? parseInt(margins.right as string, 10) : 0;

            if (marginLeft === 0 && marginRight === 0) {
                return data[name].toString();
            }

            return "calc(" + data[name].toString() + " - " + (marginLeft + marginRight) + "px)";
        }
    }
}
