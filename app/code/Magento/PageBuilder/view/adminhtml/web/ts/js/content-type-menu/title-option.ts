/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Option from "./option";
import OptionInterface, {OptionConfigInterface} from "./option.types";

export default class TitleOption extends Option implements OptionInterface {
    /**
     * @param {OptionConfigInterface} options
     */
    constructor(
        options: OptionConfigInterface,
    ) {
        super(options);

        // Modify the icon when changes are made to display in the data store
        this.preview.displayLabel.subscribe((label: string) => {
            this.title(label);
        });
    }
}
