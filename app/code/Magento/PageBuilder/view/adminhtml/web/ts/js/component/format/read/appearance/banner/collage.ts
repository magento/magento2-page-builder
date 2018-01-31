/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ReadInterface} from "../../../read-interface";
import {decodeUrl} from "../../../../../utils/image";

interface BannerObject {
    background_image?: string;
    mobile_image?: string;
}

export default class Collage implements ReadInterface {
    /**
     * Read background from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<BannerObject> {
        const response: BannerObject = {background_image: null, mobile_image: null};
        let background;
        let mobile;
        background = element.children[0].style.backgroundImage;
        response.background_image = decodeUrl(background);
        if (element.children[1] !== undefined
            && element.children[1].style.backgroundImage !== ""
            && background !== element.children[1].style.backgroundImage
        ) {
            mobile = element.children[1].style.backgroundImage;
            response.mobile_image = decodeUrl(mobile);
        }
        return Promise.resolve(response);
    }
}
