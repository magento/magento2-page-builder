/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import BaseContent from "./content";

export default class ContentCollection extends BaseContent {
    /**
     * Retrieve the child template
     *
     * @returns {string}
     */
    get renderChildTemplate(): string {
        return "Magento_PageBuilder/content-type/master-collection";
    }
}
