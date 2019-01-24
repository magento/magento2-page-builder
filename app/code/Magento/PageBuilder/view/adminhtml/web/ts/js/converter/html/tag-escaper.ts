/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {escape, unescape} from "underscore";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

export default class TagEscaper implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        const result = unescape(value);
        // Have to do a manual &nbsp; replace since underscore un-escape does not un-escape &nbsp;
        return result.replace(/&nbsp;/g, String.fromCharCode(160));
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        return escape(get(data, name));
    }
}
