/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ConverterInterface} from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";

export default class Display implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | DataObject}
     */
    public toDom(name: string, data: DataObject): string | object {
        if (
            data.background_color === ""
            && data.background_image.length === 0
            && (!data.link_url || !data.link_url.default || data.link_url.default === "")
            && data.message === ""
            && data.show_button === "never"
            && data.show_overlay === "never"
        ) {

            return "none";
        }

        return;
    }
}
