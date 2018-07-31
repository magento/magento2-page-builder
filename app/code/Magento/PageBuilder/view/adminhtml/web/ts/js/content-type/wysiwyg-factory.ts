/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";

/**
 * Create new wysiwyg adapter instance
 * @param {string} elementId
 * @param {object} config
 * @returns {WysiwygSetup}
 * @api
 */
export default function create(
    elementId: string,
    config: object,
): WysiwygSetup {
    const wysiwygSetup =  new WysiwygSetup(elementId, config.adapter);

    if (config.additional.mode) {
        wysiwygSetup.setup(config.additional.mode);
    }

    return wysiwygSetup.wysiwygInstance;
}
