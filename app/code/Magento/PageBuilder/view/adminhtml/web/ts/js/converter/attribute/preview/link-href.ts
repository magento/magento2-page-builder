/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import _ from "underscore";
import {DataObject} from "../../../data-store";
import ConverterInterface from "../../converter-interface";

/**
 * @api
 */
export default class CreateValueForHref implements ConverterInterface {
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
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        const link = data[name] as any;
        let href = "";

        if (!link) {
            return href;
        }

        const linkType = link.type;

        if (link[linkType]) {
            href = link[linkType];
        }

        return href;
    }
}
