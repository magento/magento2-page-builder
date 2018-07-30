/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import _ from "underscore";

/**
 * @api
 */
export default function createFromConfig(wysiwygConfig: object) {
    const clonedWysiwygConfig = $.extend(true, {}, wysiwygConfig);

    if (clonedWysiwygConfig.encapsulateSelectorConfigKeys) {
        _.each(clonedWysiwygConfig.encapsulateSelectorConfigKeys, (isEnabled, configKey) => {
            const configValue = clonedWysiwygConfig.wysiwygConfigData.settings[configKey];

            if (!isEnabled) {
                return;
            }

            clonedWysiwygConfig.wysiwygConfigData.settings[configKey] = (
                "#" + this.parent.id + (configValue ? " " + configValue : "")
            );
        });
    }

    return clonedWysiwygConfig;
}
