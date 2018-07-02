/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";

/**
 * Get config for appearance
 *
 * @param {string} contentType
 * @param {string} appearance
 * @returns {Object}
 * @api
 */
export default function getAppearanceConfig(contentType: string, appearance: string): object {
    const contentTypeConfig = Config.getContentTypeConfig(contentType);
    let config = {};
    if (contentTypeConfig.appearances !== undefined) {
        if (!appearance) {
            for (const key in contentTypeConfig.appearances) {
                if (!!contentTypeConfig.appearances[key].default) {
                    appearance = key;
                    break;
                }
            }
        }
        if (appearance) {
            config = contentTypeConfig.appearances[appearance];
        }
    }
    return config;
}
