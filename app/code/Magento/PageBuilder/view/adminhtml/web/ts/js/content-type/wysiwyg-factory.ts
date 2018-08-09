/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import WysiwygSetupInterface from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import WysiwygInstanceInterface from "wysiwygAdapter";
import {AdditionalDataConfigInterface} from "../content-type-config";

/**
 * Create new wysiwyg adapter instance
 * @param {string} elementId
 * @param {AdditionalDataConfigInterface} config
 * @returns {WysiwygInstanceInterface}
 * @api
 */
export default function create(
    elementId: string,
    config: AdditionalDataConfigInterface,
): WysiwygInstanceInterface {
    const wysiwygSetup =  new WysiwygSetupInterface(elementId, config.adapter);

    if (config.additional.mode) {
        wysiwygSetup.setup(config.additional.mode);
    }

    return wysiwygSetup.wysiwygInstance;
}
