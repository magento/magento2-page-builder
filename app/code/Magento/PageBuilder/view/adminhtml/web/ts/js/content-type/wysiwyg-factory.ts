/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import WysiwygInstance from "wysiwygAdapter";
import {AdditionalDataConfigInterface} from "../content-type-config";

/**
 * Create new wysiwyg adapter instance
 * @param {string} elementId
 * @param {AdditionalDataConfigInterface} config
 * @returns {WysiwygInstance}
 * @api
 */
export default function create(
    elementId: string,
    config: AdditionalDataConfigInterface,
): WysiwygInstance {
    const wysiwygSetup =  new WysiwygSetup(elementId, config.adapter);

    if (config.additional.mode) {
        wysiwygSetup.setup(config.additional.mode);
    }

    return wysiwygSetup.wysiwygInstance;
}
