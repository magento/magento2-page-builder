/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../../config";
import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";

/**
 * @api
 */
export default class WhiteSpace implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
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
        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return "pre";
        }

        return "";
    }
}
