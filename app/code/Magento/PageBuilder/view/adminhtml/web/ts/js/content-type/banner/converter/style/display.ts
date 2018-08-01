/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import BaseDisplay from "../../../../converter/style/display";
import {DataObject} from "../../../../data-store";

export default class Display extends BaseDisplay implements ConverterInterface {
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
     * Hide the banner if the banner is empty on the storefront, fallback to support the ability to hide items
     *
     * @param name string
     * @param data Object
     * @returns {string | void}
     */
    public toDom(name: string, data: DataObject) {
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
        return super.toDom(name, data);
    }
}
