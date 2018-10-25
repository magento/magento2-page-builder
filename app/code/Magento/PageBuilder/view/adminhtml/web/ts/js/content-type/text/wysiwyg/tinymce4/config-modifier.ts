/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import WysiwygConfigInitializerInterface from "../../../../wysiwyg/config-modifier-interface";

export default class ConfigModifier implements WysiwygConfigInitializerInterface {
    /**
     * Initialize the config
     *
     * @param {String} contentTypeId
     * @param {Object} config
     */
    public modify(contentTypeId: string, config: any): void {
        if (config.adapter_config.mode === "inline") {
            config.adapter.settings.fixed_toolbar_container = "#" + contentTypeId
                + " " + config.adapter.settings.fixed_toolbar_container;
        }
    }
}
