/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";

export default class ButtonItem extends Block {

    /**
     * Get the attributes for link
     * returns {object}
     */
    public getLinkAttributes(): {} {
        const data = this.getData();
        return {
            //add here logic to
            href: data.button_link[data.button_link.type],
            data_attribute_link_type: data.button_link.type,
            target: data.button_link.setting == true ? "_blank" : "",
        };
    }
}
