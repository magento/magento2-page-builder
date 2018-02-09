/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Buttons extends PreviewBlock {

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();

        // Declare our buttons, they'll get populated later
        this.updateDataValue("buttons", []);
    }
}
