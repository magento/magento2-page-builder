/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../data-store";

/**
 * @deprecated
 */
export default class AttributeMapper {
    // Attribute name mapping
    private attributeNameMapping: AttributeNameMapping = {
        appearance: "data-appearance",
        element: "data-element",
        autoplay: "data-autoplay",
        autoplay_speed: "data-autoplay-speed",
        border: "data-border",
        button_text: "data-button-text",
        button_type: "data-button-type",
        category_id: "data-category-id",
        enable_parallax: "data-enable-parallax",
        fade: "data-fade",
        has_overlay_background: "data-has-overlay-background",
        id: "id",
        identifier: "data-identifier",
        is_infinite: "data-is-infinite",
        label_text: "data-label-text",
        name: "data-role",
        parallax_speed: "data-speed",
        placeholder: "data-placeholder",
        product_count: "data-product-count",
        show_arrows: "data-show-arrows",
        show_button: "data-show-button",
        show_dots: "data-show-dots",
        show_out_of_stock: "data-show-out-of-stock",
        show_overlay: "data-show_overlay",
        sku: "data-sku",
        src: "src",
        title: "data-title",
        view_mode: "data-view-mode",
    };

    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    public toDom(data: DataObject): DataObject {
        const result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                const value = data[key];
                if (key in this.attributeNameMapping) {
                    key = this.attributeNameMapping[key];
                }
                result[key.replace("_", "-")] = value;
            },
        );
        return result;
    }

    /**
     * Convert attributes from the DOM into the data store
     *
     * @param {} data
     * @returns {}
     */
    public fromDom(data: DataObject): DataObject {
        // Flip the object key / values
        const attributeMapping: AttributeNameMapping = Object.keys(
            this.attributeNameMapping,
        ).reduce((obj: DataObject, key) => {
            obj[this.attributeNameMapping[key]] = key;
            return obj;
        }, {});
        const result: DataObject = {};

        Object.keys(data).map(
            (key: string) => {
                if (key in attributeMapping) {
                    result[attributeMapping[key]] = data[key];
                }
            },
        );
        return result;
    }
}

export interface AttributeNameMapping {
    [key: string]: string;
}
