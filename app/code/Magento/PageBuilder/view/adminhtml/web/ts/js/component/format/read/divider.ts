/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {toHex} from "../../../utils/color-converter";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

export default class Divider implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const dividerElement = element.querySelector("hr");
        const response: DataObject = {
            line_color: dividerElement.style.borderColor ? toHex(dividerElement.style.borderColor) : "",
            line_thickness: dividerElement.style.borderWidth.replace("px", ""),
            line_width: dividerElement.style.width,
        };

        return Promise.resolve(response);
    }
}
