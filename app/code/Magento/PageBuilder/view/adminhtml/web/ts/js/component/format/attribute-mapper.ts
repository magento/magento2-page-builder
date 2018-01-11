/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../component/data-store";

export default class AttributeMapper {
    // Attribute name mapping
    protected attributeNameMapping: DataObject = {
        advanced_settings: "data-advanced-settings",
        appearance: "data-appearance",
        autoplay: "data-autoplay",
        autoplay_speed: "data-autoplay-speed",
        button_text: "data-button-text",
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
        show_dots: "data-show-dots",
        show_out_of_stock: "data-show-out-of-stock",
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
                let value = data[key];
                if (key in this.attributeNameMapping) {
                    key = this.attributeNameMapping[key];
                }
                if (key === "position") {
                    const [lat, lng, zoom] = value.split(",");
                    key = "src";
                    value = "https://www.google.com/maps/embed/v1/place?q="
                        + lat + "," + lng + "&zoom=" + zoom + "&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw";
                }
                result[key.replace("_", "-")] = value;
            },
        );
        if (result.position && result.src) {
            result.src = result.position;
            delete result.position;
        }
        return result;
    }

    /**
     * Convert attributes from the DOM into the data store
     * @param {} data
     * @returns {}
     */
    public fromDom(data: DataObject): DataObject {
        // Flip the object key / values
        const attributeMapping = Object.keys(this.attributeNameMapping).reduce((obj: DataObject, key) => {
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
