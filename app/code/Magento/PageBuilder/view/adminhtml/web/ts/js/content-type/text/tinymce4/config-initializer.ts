/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {WysiwygConfigInitializerInterface} from "../../wysiwyg-initializer-interface";

export default class ConfigInitializer implements WysiwygConfigInitializerInterface {
    /**
     * Initialize the config
     *
     * @param {String} contentTypeId
     * @param {Object} config
     */
    public initializeConfig(contentTypeId: string, config: any): void {
        if (config.additional.mode === "inline") {
            config.adapter.settings.fixed_toolbar_container = "#" + contentTypeId
                + " " + config.adapter.settings.fixed_toolbar_container;
        }
    }
}
