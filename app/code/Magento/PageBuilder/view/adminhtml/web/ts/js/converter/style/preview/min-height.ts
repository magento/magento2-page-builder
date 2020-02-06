/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../../data-store";
import {get} from "../../../utils/object";
import ConverterInterface from "../../converter-interface";
import RemovePx from "../remove-px";

/**
 * @api
 */
export default class MinHeight extends RemovePx implements ConverterInterface {
    /**
     * Ensure the min-height property doesn't persist to the preview
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return;
    }

    /**
     * Ensure the min-height property doesn't persist to the preview in case of full height.
     *
     * @param name string
     * @param data Object
     * @returns string
     */
    public toDom(name: string, data: DataObject): string {
        const value = get<string>(data, name);
        if (value === "100vh") {
            return;
        }

        return super.toDom(name, data);
    }
}
