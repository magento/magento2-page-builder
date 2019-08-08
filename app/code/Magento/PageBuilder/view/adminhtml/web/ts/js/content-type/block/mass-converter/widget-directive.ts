/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ConverterConfigInterface, ConverterDataInterface} from "../../../mass-converter/converter-interface";
import BaseWidgetDirective from "../../../mass-converter/widget-directive-abstract";
import {set} from "../../../utils/object";

/**
 * Enables the settings of the content type to be stored as a widget directive.
 *
 * @api
 */
export default class WidgetDirective extends BaseWidgetDirective {
    /**
     * Convert value to internal format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const attributes = super.fromDom(data, config);

        data.template = attributes.template;
        data.block_id = attributes.block_id;
        return data;
    }

    /**
     * Convert value to knockout format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public toDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const attributes = {
            type: "Magento\\Cms\\Block\\Widget\\Block",
            template: data.template,
            block_id: data.block_id,
            type_name: "CMS Static Block",
        };

        if (!attributes.block_id || !attributes.template) {
            return data;
        }

        set(data, config.html_variable, this.buildDirective(attributes));
        return data;
    }
}
