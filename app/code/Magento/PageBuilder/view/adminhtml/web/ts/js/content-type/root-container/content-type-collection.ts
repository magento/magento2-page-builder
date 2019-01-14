/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import alertDialog from "Magento_Ui/js/modal/alert";
import ContentTypeCollection from "../../content-type-collection";

/**
 * @api
 */
export default class RootContainer extends ContentTypeCollection {
    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        if (this.getChildren().length === 1) {
            alertDialog({
                content: $t("You are not able to remove the final row from the content."),
                title: $t("Unable to Remove"),
            });
            return;
        }
        super.removeChild(child);
    }
}
