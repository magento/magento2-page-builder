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
     * @returns {void}
     */
    public fromDom(value: string): void {
        return;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | void}
     */
    public toDom(name: string, data: DataObject): string | void {
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
