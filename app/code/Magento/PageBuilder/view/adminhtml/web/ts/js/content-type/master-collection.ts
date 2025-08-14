/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

import BaseMaster from "./master";

export default class MasterCollection extends BaseMaster {
    /**
     * Retrieve the child template
     *
     * @returns {string}
     */
    get masterTemplate(): string {
        return "Magento_PageBuilder/content-type/master-collection";
    }
}
