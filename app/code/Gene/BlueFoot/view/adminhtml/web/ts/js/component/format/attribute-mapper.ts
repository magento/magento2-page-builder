/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

/*eslint-disable */
export default class AttributeMapper {
    // Attribute name mapping
    attributeNameMapping: DataObject = {
        id: 'id',
        name: 'data-role',
        appearance: 'data-appearance',
        identifier: 'data-identifier',
        button_text: 'data-button-text',
        label_text: 'data-label-text',
        placeholder: 'data-placeholder',
        title: 'data-title',
        view_mode: 'data-view-mode',
        sku: 'data-sku',
        category_id: 'data-category-id',
        product_count: 'data-product-count',
        show_out_of_stock: 'data-show-out-of-stock',
        autoplay: 'data-autoplay',
        autoplay_speed: 'data-autoplay-speed',
        fade: 'data-fade',
        is_infinite: 'data-is-infinite',
        show_arrows: 'data-show-arrows',
        show_dots: 'data-show-dots',
        advanced_settings: 'data-advanced-settings',
        has_overlay_background: 'data-has-overlay-background',
        enable_parallax: 'data-enable-parallax',
        parallax_speed: 'data-speed'
    };

    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    toDom(data: DataObject): DataObject {
        let result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                let value = data[key];
                if (key in this.attributeNameMapping) {
                    key = this.attributeNameMapping[key];
                }
                if (key === 'position') {
                    const [lat, lng, zoom] = value.split(',');
                    key = 'src';
                    value = 'https://www.google.com/maps/embed/v1/place?q=' + lat + ',' + lng + '&zoom=' + zoom + '&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw';
                }
                result[key.replace('_', '-')] = value;
            }
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
    fromDom(data: DataObject): DataObject {
        // Flip the object key / values
        let attributeMapping = Object.keys(this.attributeNameMapping).reduce((obj: DataObject, key) => {
            obj[this.attributeNameMapping[key]] = key;
            return obj;
        }, {}),
            result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                if (key in attributeMapping) {
                    result[attributeMapping[key]] = data[key];
                }
            }
        );
        return result;
    }
}
