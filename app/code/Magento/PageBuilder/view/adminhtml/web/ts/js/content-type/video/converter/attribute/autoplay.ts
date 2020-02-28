/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {get} from "../../../../utils/object";

export default class VideoSrc implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value === "true" ? value : "false";
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {boolean|string}
     */
    public toDom(name: string, data: DataObject): boolean|string {
        const value = get<string>(data, name);

        return value === "true" ? true : null;
    }
}
