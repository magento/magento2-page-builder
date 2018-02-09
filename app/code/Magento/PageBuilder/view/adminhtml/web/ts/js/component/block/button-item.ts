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
            href: data.button_link,
            target: data.open_in_new_tab === "1" ? "_blank" : "",
        };
    }
}
