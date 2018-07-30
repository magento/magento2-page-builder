/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import _ from "underscore";
import ContentTypeInterface from "../content-type.d";

/**
 * @api
 */
export default function createConfigBasedOnContentType(contentType: ContentTypeInterface, wysiwygConfig: object) {
    const clonedWysiwygConfig = $.extend(true, {}, wysiwygConfig);

    if (clonedWysiwygConfig.encapsulateSelectorConfigKeys) {
        _.each(clonedWysiwygConfig.encapsulateSelectorConfigKeys, (isEnabled, configKey) => {
            const configValue = clonedWysiwygConfig.wysiwygConfigData.settings[configKey];

            if (!isEnabled) {
                return;
            }

            clonedWysiwygConfig.wysiwygConfigData.settings[configKey] = (
                "#" + contentType.id + (configValue ? " " + configValue : "")
            );
        });
    }

    return clonedWysiwygConfig;
}
