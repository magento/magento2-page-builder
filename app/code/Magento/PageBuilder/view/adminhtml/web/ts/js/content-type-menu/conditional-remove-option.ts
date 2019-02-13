/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Option from "./option";
import OptionInterface, {OptionConfigInterface} from "./option.types";

export default class ConditionalRemoveOption extends Option implements OptionInterface {
    /**
     * @param {OptionConfigInterface} config
     */
    constructor(
        config: OptionConfigInterface,
    ) {
        super(config);

        const parentContentType = this.preview.contentType.parentContentType;
        if (parentContentType.children().length < 2) {
            this.isDisabled(true);
        }
        parentContentType.children.subscribe((children) => {
            this.isDisabled((children.length < 2));
        });
    }
}
